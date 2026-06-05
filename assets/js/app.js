// NexoCreator app

const KEY = 'nexocreator_fichas_v1';

let current = null;

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

function all() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

function write(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

function newDraft() {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'BORRADOR',
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
  current.status = current.status || 'BORRADOR';
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

  current.status = current.status || 'BORRADOR';
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

function saveDraft() {
  const draft = collect();
  const fichas = all();
  const index = fichas.findIndex(function(item) {
    return item.id === draft.id;
  });

  if (index >= 0) fichas[index] = draft;
  else fichas.unshift(draft);

  write(fichas);
  alert('Ficha guardada');
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

function showPreview() {
  const draft = collect();
  const sections = draft.sections;

  hideAll();
  $('preview').innerHTML =
    (draft.cover_image ? '<img class="cover" src="' + draft.cover_image + '">' : '') +
    '<h1>' + escapeHtml(draft.common_name || 'Ficha sin nombre') + '</h1>' +
    '<div class="scientific">' + escapeHtml(draft.scientific_name || '') + '</div>' +
    '<p class="muted">' + labelCat(draft.category) + '</p>' +
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
    '<button class="primary" onclick="openEditor(window.current)">← Editar</button>';
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

window.goHome = goHome;
window.showNew = showNew;
window.hideAll = hideAll;
window.$ = $;
window.newDraft = newDraft;
window.openEditor = openEditor;
window.startFromPhoto = startFromPhoto;
window.removeCover = removeCover;
window.renderCover = renderCover;
window.replaceCover = replaceCover;
window.all = all;
window.write = write;
window.collect = collect;
window.saveDraft = saveDraft;
window.labelCat = labelCat;
window.escapeHtml = escapeHtml;
window.block = block;
window.showPreview = showPreview;
window.exportCurrent = exportCurrent;
window.current = current;
