// NexoCreator app

const KEY = 'nexocreator_fichas_v1';
const REVIEW_KEY = 'nexocreator_review_queue_v1';
const ACUARIONEXO_OUTBOX_KEY = 'nexocreator_acuarionexo_outbox_v1';

const STATUS = {
  DRAFT: 'BORRADOR',
  REVIEW: 'EN_REVISION',
  VALIDATED: 'VALIDADA',
  SENT: 'ENVIADA_A_ACUARIONEXO'
};

let current = null;

const supa = window.supabase.createClient(
  window.ACUARIONEXO_CONFIG.SUPABASE_URL,
  window.ACUARIONEXO_CONFIG.SUPABASE_KEY
);

function rowToDraft(row) {
  return row.ficha_json || {
    id: row.id,
    status: row.status,
    category: row.category,
    common_name: row.common_name,
    scientific_name: row.scientific_name,
    cover_image: row.cover_image,
    created_at: row.created_at,
    updated_at: row.updated_at,
    sections: {}
  };
}


function $(id) {
  return document.getElementById(id);
}

function hideAll() {
  ['home','newMenu','editor','list','preview'].forEach(function(id) {
    $(id).classList.add('hidden');
  });
}

function goHome() {
  hideAll();
  $('home').classList.remove('hidden');
}

function showNew() {
  hideAll();
  $('newMenu').classList.remove('hidden');
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (err) {
    console.warn('No se pudo leer localStorage:', key, err);
    return [];
  }
}

function writeJson(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

async function all() {
  const { data, error } = await supa
    .from('fichas_creator')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error leyendo fichas_creator:', error);
    alert('No se pudieron cargar las fichas');
    return [];
  }

  return (data || []).map(rowToDraft);
}

function write(arr) {
  writeJson(KEY, arr);
}

function reviewQueue() {
  return readJson(REVIEW_KEY);
}

function writeReviewQueue(arr) {
  writeJson(REVIEW_KEY, arr);
}

function acuarioNexoOutbox() {
  return readJson(ACUARIONEXO_OUTBOX_KEY);
}

function writeAcuarioNexoOutbox(arr) {
  writeJson(ACUARIONEXO_OUTBOX_KEY, arr);
}

function upsertById(arr, draft) {
  const index = arr.findIndex(function(item) {
    return item.id === draft.id;
  });

  if (index >= 0) arr[index] = draft;
  else arr.unshift(draft);

  return arr;
}

function removeById(arr, id) {
  return arr.filter(function(item) {
    return item.id !== id;
  });
}

function newDraft() {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: STATUS.DRAFT,
    category: 'pez_marino',
    common_name: '',
    scientific_name: '',
    cover_image: '',
    sections: {
      summary: '',
      habitat: '',
      aquarium: '',
      feeding: '',
      compatibility: '',
      health: '',
      purchase: '',
      mistakes: '',
      curiosities: '',
      sources: ''
    }
  };
}

function readFile(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function startFromPhoto(ev) {
  const file = ev.target.files[0];
  if (!file) return;

  const draft = newDraft();
  draft.cover_image = await readFile(file);

  openEditor(draft);
  ev.target.value = '';
}

function openEditor(draft) {
  current = draft;
  current.status = current.status || STATUS.DRAFT;
  window.current = current;

  hideAll();
  $('editor').classList.remove('hidden');
  $('category').value = draft.category || 'pez_marino';
  $('commonName').value = draft.common_name || '';
  $('scientificName').value = draft.scientific_name || '';
  const sections = draft.sections || {};
  $('summary').value = sections.summary || '';
  $('habitat').value = sections.habitat || '';
  $('aquarium').value = sections.aquarium || '';
  $('feeding').value = sections.feeding || '';
  $('compatibility').value = sections.compatibility || '';
  $('health').value = sections.health || '';
  $('purchase').value = sections.purchase || '';
  $('mistakes').value = sections.mistakes || '';
  $('curiosities').value = sections.curiosities || '';
  $('sources').value = sections.sources || '';
  renderCover();
}

async function openById(id) {
  const { data, error } = await supa
    .from('fichas_creator')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error abriendo ficha:', error);
    alert('No se encontró la ficha');
    return;
  }

  openEditor(rowToDraft(data));
}

function renderCover() {
  const box = $('coverBox');
  if (!box) return;

  if (current && current.cover_image) {
    box.innerHTML = '<img class="cover" src="' + current.cover_image + '" alt="portada">';
    return;
  }

  box.innerHTML = '<div class="placeholder">Sin foto de portada</div>';
}

async function replaceCover(ev) {
  const file = ev.target.files[0];
  if (!file || !current) return;

  current.cover_image = await readFile(file);
  window.current = current;
  renderCover();
  ev.target.value = '';
}

function removeCover() {
  if (!current) return;

  current.cover_image = '';
  window.current = current;
  renderCover();
}

function collect() {
  if (!current) current = newDraft();

  current.status = current.status || STATUS.DRAFT;
  current.category = $('category').value;
  current.common_name = $('commonName').value.trim();
  current.scientific_name = $('scientificName').value.trim();
  current.updated_at = new Date().toISOString();
  current.sections = {
    summary: $('summary').value,
    habitat: $('habitat').value,
    aquarium: $('aquarium').value,
    feeding: $('feeding').value,
    compatibility: $('compatibility').value,
    health: $('health').value,
    purchase: $('purchase').value,
    mistakes: $('mistakes').value,
    curiosities: $('curiosities').value,
    sources: $('sources').value
  };

  window.current = current;
  return current;
}

async function saveFicha(draft) {
  const payload = {
    id: draft.id,
    status: draft.status || STATUS.DRAFT,
    category: draft.category || '',
    common_name: draft.common_name || '',
    scientific_name: draft.scientific_name || '',
    cover_image: draft.cover_image || '',
    ficha_json: draft,
    created_at: draft.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error } = await supa
    .from('fichas_creator')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error('Error guardando ficha:', error);
    alert('No se pudo guardar la ficha');
    return null;
  }

  return draft;
}

async function saveDraft() {
  const draft = collect();
  const saved = await saveFicha(draft);
  if (saved) alert('Ficha guardada');
}

function sendToReview() {
  const draft = collect();
  draft.status = STATUS.REVIEW;
  draft.review_requested_at = new Date().toISOString();

  saveFicha(draft);
  writeReviewQueue(upsertById(reviewQueue(), draft));
  window.current = draft;

  alert('Ficha enviada a revisión');
  showPreview();
}

function validateCurrent() {
  const draft = collect();

  if (draft.status !== STATUS.REVIEW) {
    alert('Solo se puede validar una ficha en revisión');
    return;
  }

  draft.status = STATUS.VALIDATED;
  draft.validated_at = new Date().toISOString();

  saveFicha(draft);
  writeReviewQueue(removeById(reviewQueue(), draft.id));
  window.current = draft;

  alert('Ficha validada');
  showPreview();
}

function sendToAcuarioNexo() {
  const draft = collect();

  if (draft.status !== STATUS.VALIDATED) {
    alert('Solo se puede enviar a AcuarioNexo una ficha validada');
    return;
  }

  draft.status = STATUS.SENT;
  draft.sent_to_acuarionexo_at = new Date().toISOString();

  saveFicha(draft);
  writeAcuarioNexoOutbox(upsertById(acuarioNexoOutbox(), draft));
  window.current = draft;

  alert('Ficha enviada a AcuarioNexo');
  showPreview();
}

function labelStatus(value) {
  return {
    BORRADOR: 'Borrador',
    EN_REVISION: 'En revisión',
    VALIDADA: 'Validada',
    ENVIADA_A_ACUARIONEXO: 'Enviada a AcuarioNexo'
  }[value] || value || 'Borrador';
}

function labelCat(value) {
  return {
    pez_marino: 'Pez marino',
    pez_dulce: 'Pez dulce',
    coral: 'Coral',
    invertebrado: 'Invertebrado',
    planta: 'Planta',
    microfauna: 'Microfauna',
    sal: 'Sal',
    medicamento: 'Medicamento',
    alimento: 'Alimento',
    equipamiento: 'Equipamiento'
  }[value] || value;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, function(match) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[match];
  });
}

function block(title, content) {
  if (!content) return '';
  return '<div class="section"><h2>' + title + '</h2><p>' + escapeHtml(content).replace(/\n/g, '<br>') + '</p></div>';
}

function transitionButtons(draft) {
  if (draft.status === STATUS.DRAFT) {
    return '<button onclick="sendToReview()">Enviar a revisión</button>';
  }

  if (draft.status === STATUS.REVIEW) {
    return '<button class="primary" onclick="validateCurrent()">Validar ficha</button>';
  }

  if (draft.status === STATUS.VALIDATED) {
    return '<button class="primary" onclick="sendToAcuarioNexo()">Enviar a AcuarioNexo</button>';
  }

  return '';
}

function showPreview() {
  const draft = collect();
  const sections = draft.sections;

  hideAll();
  $('preview').innerHTML =
    (draft.cover_image ? '<img class="cover" src="' + draft.cover_image + '">' : '') +
    '<h1>' + escapeHtml(draft.common_name || 'Ficha sin nombre') + '</h1>' +
    '<div class="scientific">' + escapeHtml(draft.scientific_name || '') + '</div>' +
    '<p class="muted">' + labelCat(draft.category) + ' · Estado: ' + labelStatus(draft.status) + '</p>' +
    block('Resumen rápido', sections.summary) +
    block('Hábitat natural', sections.habitat) +
    block('Acuario recomendado', sections.aquarium) +
    block('Alimentación', sections.feeding) +
    block('Compatibilidad', sections.compatibility) +
    block('Salud', sections.health) +
    block('Antes de comprar', sections.purchase) +
    block('Errores frecuentes', sections.mistakes) +
    block('Curiosidades', sections.curiosities) +
    block('Fuentes', sections.sources) +
    '<button class="primary" onclick="openEditor(window.current)">← Editar</button>' +
    transitionButtons(draft);
  $('preview').classList.remove('hidden');
}

function exportCurrent() {
  const draft = collect();
  const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = (draft.common_name || 'ficha').toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-') + '.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

window.STATUS = STATUS;
window.goHome = goHome;
window.showNew = showNew;
window.hideAll = hideAll;
window.$ = $;
window.newDraft = newDraft;
window.openEditor = openEditor;
window.openById = openById;
window.startFromPhoto = startFromPhoto;
window.removeCover = removeCover;
window.renderCover = renderCover;
window.replaceCover = replaceCover;
window.all = all;
window.write = write;
window.reviewQueue = reviewQueue;
window.writeReviewQueue = writeReviewQueue;
window.acuarioNexoOutbox = acuarioNexoOutbox;
window.writeAcuarioNexoOutbox = writeAcuarioNexoOutbox;
window.collect = collect;
window.saveDraft = saveDraft;
window.saveFicha = saveFicha;
window.sendToReview = sendToReview;
window.validateCurrent = validateCurrent;
window.sendToAcuarioNexo = sendToAcuarioNexo;
window.labelStatus = labelStatus;
window.labelCat = labelCat;
window.escapeHtml = escapeHtml;
window.block = block;
window.transitionButtons = transitionButtons;
window.showPreview = showPreview;
window.exportCurrent = exportCurrent;
window.current = current;
