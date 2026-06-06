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
    species_photo: row.species_photo || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
    sections: {}
  };
}

function $(id) {
  return document.getElementById(id);
}

function hideAll() {
  ['home','newMenu','editor','list','preview','authPanel'].forEach(function(id) {
    const el = $(id);
    if (el) el.classList.add('hidden');
  });
}

function goHome() {
  hideAll();
  $('home').classList.remove('hidden');
  updateAuthStatus();
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
    .neq('status', STATUS.SENT)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error leyendo fichas_creator:', error);
    alert('No se pudieron cargar las fichas: ' + (error.message || JSON.stringify(error)));
    return [];
  }

  return (data || []).map(rowToDraft).filter(function(draft) {
    return draft.status !== STATUS.SENT;
  });
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
    species_photo: '',
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
    alert('No se encontró la ficha: ' + ((error && error.message) || 'sin datos'));
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
  current.species_photo = current.species_photo || '';
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
    alert('No se pudo guardar la ficha: ' + (error.message || JSON.stringify(error)));
    return null;
  }

  return draft;
}

async function saveDraft() {
  const draft = collect();
  const saved = await saveFicha(draft);
  if (saved) alert('Ficha guardada');
}

async function sendToReview() {
  return sendToAcuarioNexo();
}

async function validateCurrent() {
  return sendToAcuarioNexo();
}

function libraryCategory(value) {
  return {
    pez_marino: 'fish',
    pez_dulce: 'fish',
    coral: 'coral',
    invertebrado: 'invertebrate',
    planta: 'plant',
    microfauna: 'other',
    sal: 'other',
    medicamento: 'other',
    alimento: 'other',
    equipamiento: 'other'
  }[value] || value || 'other';
}

async function sendToAcuarioNexo() {
  const draft = (window.current && window.current.id) ? window.current : collect();
  const sections = draft.sections || {};
  const title = draft.common_name || draft.scientific_name || 'Ficha sin nombre';

  if (!title || title === 'Ficha sin nombre') {
    alert('Pon al menos un nombre antes de pasar la ficha a AcuarioNexo');
    return;
  }

  const userResult = await supa.auth.getUser();
  const user = userResult && userResult.data && userResult.data.user;

  if (!user) {
    alert('Inicia sesión antes de pasar la ficha a AcuarioNexo');
    showLogin();
    return;
  }

  const libraryRow = {
    user_id: user.id,
    title: title,
    scientific_name: draft.scientific_name || null,
    category: libraryCategory(draft.category),
    description: sections.summary || null,
    photo_url: finalSpeciesPhoto(draft) || null,
    feeding: sections.feeding || null,
    compatibility: sections.compatibility || null,
    references_text: sections.sources || null,
    parameters: {},
    updated_at: new Date().toISOString()
  };

  let existing = null;

  if (draft.scientific_name) {
    const foundByScientific = await supa
      .from('library_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('scientific_name', draft.scientific_name)
      .limit(1);

    if (foundByScientific.error) {
      console.error('Error buscando ficha en AcuarioNexo:', foundByScientific.error);
      alert('No se pudo comprobar si la ficha ya existe en AcuarioNexo: ' + foundByScientific.error.message);
      return;
    }

    existing = (foundByScientific.data || [])[0] || null;
  }

  if (!existing) {
    const foundByTitle = await supa
      .from('library_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('title', title)
      .limit(1);

    if (foundByTitle.error) {
      console.error('Error buscando ficha por título en AcuarioNexo:', foundByTitle.error);
      alert('No se pudo comprobar si la ficha ya existe en AcuarioNexo: ' + foundByTitle.error.message);
      return;
    }

    existing = (foundByTitle.data || [])[0] || null;
  }

  const result = existing
    ? await supa.from('library_entries').update(libraryRow).eq('id', existing.id)
    : await supa.from('library_entries').insert(libraryRow);

  if (result.error) {
    console.error('Error pasando ficha a AcuarioNexo:', result.error);
    alert('No se pudo pasar la ficha a AcuarioNexo: ' + result.error.message);
    return;
  }

  draft.status = STATUS.SENT;
  draft.sent_to_acuarionexo_at = new Date().toISOString();
  await saveFicha(draft);
  window.current = draft;
  current = draft;

  alert('Ficha pasada a AcuarioNexo');
  showList();
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
  if (draft.status === STATUS.SENT) {
    return '<button class="small" disabled>✅ Ya enviada a AcuarioNexo</button>';
  }

  return '<button class="primary" onclick="sendToAcuarioNexo()">📲 Pasar a AcuarioNexo</button>';
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

function finalSpeciesPhoto(draft) {
  return draft.species_photo ||
    draft.speciesPhoto ||
    (draft.media && draft.media.species_photo) ||
    (draft.media && draft.media.speciesPhoto) ||
    (draft.images && draft.images.species_photo) ||
    (draft.images && draft.images.speciesPhoto) ||
    '';
}

function finalSection(title, content) {
  if (!content) return '';
  return '<section class="section fichaFinalSection"><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(content).replace(/\n/g, '<br>') + '</p></section>';
}

function renderCleanFichaFinal(draft) {
  const sections = draft.sections || {};
  const speciesPhoto = finalSpeciesPhoto(draft);

  return '' +
    '<article class="fichaFinal">' +
      (speciesPhoto ? '<img class="cover" src="' + speciesPhoto + '" alt="foto real de la especie">' : '<div class="placeholder">Sin foto de especie</div>') +
      finalSection('Resumen rápido', sections.summary) +
      finalSection('Hábitat natural', sections.habitat) +
      finalSection('Acuario recomendado', sections.aquarium) +
      finalSection('Alimentación', sections.feeding) +
      finalSection('Compatibilidad', sections.compatibility) +
      finalSection('Salud', sections.health) +
      finalSection('Antes de comprar', sections.purchase) +
      finalSection('Errores frecuentes', sections.mistakes) +
      finalSection('Curiosidades', sections.curiosities) +
      finalSection('Fuentes', sections.sources) +
    '</article>';
}

function installFinalFichaOverrides() {
  window.renderFichaFinal = renderCleanFichaFinal;

  window.openFinalById = async function(id) {
    const { data, error } = await supa
      .from('fichas_creator')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      alert('No se pudo abrir la ficha: ' + ((error && error.message) || 'sin datos'));
      return;
    }

    const draft = rowToDraft(data);
    window.current = draft;
    current = draft;

    hideAll();
    $('preview').innerHTML =
      '<button class="small" onclick="showList()">← Mis fichas</button>' +
      renderCleanFichaFinal(draft) +
      '<button class="primary" onclick="openEditor(window.current)">✏️ Editar ficha</button>' +
      transitionButtons(draft) +
      '<button class="small danger" onclick="deleteFicha(\'' + draft.id + '\')">🗑️ Borrar</button>';
    $('preview').classList.remove('hidden');
  };

  window.showList = async function() {
    hideAll();
    $('list').innerHTML = '<h2>Mis fichas</h2><p class="muted">Cargando...</p>';
    $('list').classList.remove('hidden');

    const arr = await all();
    let html = '<h2>Mis fichas</h2>';

    if (!arr.length) {
      html += '<p class="muted">Aún no hay fichas pendientes.</p>';
    }

    arr.forEach(function(f) {
      const cover = f.cover_image
        ? '<img class="listCover" src="' + f.cover_image + '" alt="portada">'
        : '<div class="listCoverEmpty">Sin portada</div>';

      html += '' +
        '<div class="listItem">' +
          '<div onclick="openFinalById(\'' + f.id + '\')">' +
            cover +
            '<div class="listBody">' +
              '<p class="muted">' + escapeHtml(labelCat(f.category)) + '</p>' +
              '<button class="primary small" onclick="event.stopPropagation();openFinalById(\'' + f.id + '\')">Ver ficha final</button>' +
              '<button class="small danger" onclick="event.stopPropagation();deleteFicha(\'' + f.id + '\')">🗑️ Borrar</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    html += '<button class="small" onclick="goHome()">← Volver</button>';
    $('list').innerHTML = html;
  };
}

function ensureAuthPanel() {
  if ($('authPanel')) return;

  const panel = document.createElement('section');
  panel.id = 'authPanel';
  panel.className = 'hidden card';
  panel.innerHTML = '' +
    '<h2>Login Supabase</h2>' +
    '<p class="muted">Usa el mismo correo y contraseña de AcuarioNexo.</p>' +
    '<input id="authEmail" type="email" placeholder="Correo">' +
    '<input id="authPassword" type="password" placeholder="Contraseña">' +
    '<button class="primary" onclick="loginSupabase()">Entrar</button>' +
    '<button onclick="registerSupabase()">Crear cuenta</button>' +
    '<button class="small" onclick="goHome()">← Volver</button>' +
    '<p id="authMessage" class="muted"></p>';

  const app = document.querySelector('.app') || document.body;
  app.appendChild(panel);
}

function ensureAuthHomeControls() {
  const homeCard = document.querySelector('#home .card');
  if (!homeCard || $('authStatus')) return;

  const status = document.createElement('p');
  status.id = 'authStatus';
  status.className = 'muted';
  status.textContent = 'Comprobando sesión...';

  const loginButton = document.createElement('button');
  loginButton.id = 'authButton';
  loginButton.type = 'button';
  loginButton.textContent = '🔐 Iniciar sesión';
  loginButton.onclick = showLogin;

  const logoutButton = document.createElement('button');
  logoutButton.id = 'logoutButton';
  logoutButton.type = 'button';
  logoutButton.className = 'small hidden';
  logoutButton.textContent = 'Cerrar sesión';
  logoutButton.onclick = logoutSupabase;

  homeCard.insertBefore(logoutButton, homeCard.firstChild);
  homeCard.insertBefore(loginButton, homeCard.firstChild);
  homeCard.insertBefore(status, homeCard.firstChild);
}

function showLogin() {
  ensureAuthPanel();
  hideAll();
  $('authPanel').classList.remove('hidden');
  if ($('authMessage')) $('authMessage').textContent = '';
}

async function updateAuthStatus() {
  ensureAuthHomeControls();
  const status = $('authStatus');
  const loginButton = $('authButton');
  const logoutButton = $('logoutButton');
  if (!status || !loginButton || !logoutButton) return;

  const { data } = await supa.auth.getUser();
  const user = data && data.user;

  if (user) {
    status.textContent = 'Sesión activa: ' + (user.email || user.id);
    loginButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    status.textContent = 'Sin sesión activa. Inicia sesión antes de pasar fichas a AcuarioNexo.';
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
  }
}

async function loginSupabase() {
  const email = $('authEmail') ? $('authEmail').value.trim() : '';
  const password = $('authPassword') ? $('authPassword').value : '';
  const msg = $('authMessage');

  if (!email || !password) {
    if (msg) msg.textContent = 'Introduce correo y contraseña.';
    return;
  }

  if (msg) msg.textContent = 'Entrando...';
  const { error } = await supa.auth.signInWithPassword({ email: email, password: password });

  if (error) {
    if (msg) msg.textContent = 'No se pudo iniciar sesión: ' + error.message;
    return;
  }

  if (msg) msg.textContent = 'Sesión iniciada.';
  await updateAuthStatus();
  goHome();
}

async function registerSupabase() {
  const email = $('authEmail') ? $('authEmail').value.trim() : '';
  const password = $('authPassword') ? $('authPassword').value : '';
  const msg = $('authMessage');

  if (!email || !password) {
    if (msg) msg.textContent = 'Introduce correo y contraseña.';
    return;
  }

  if (msg) msg.textContent = 'Creando cuenta...';
  const { error } = await supa.auth.signUp({ email: email, password: password });

  if (error) {
    if (msg) msg.textContent = 'No se pudo crear la cuenta: ' + error.message;
    return;
  }

  if (msg) msg.textContent = 'Cuenta creada. Si Supabase pide confirmación, revisa el correo; si no, la sesión queda activa.';
  await updateAuthStatus();
}

async function logoutSupabase() {
  await supa.auth.signOut();
  await updateAuthStatus();
  goHome();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    installFinalFichaOverrides();
    ensureAuthPanel();
    ensureAuthHomeControls();
    updateAuthStatus();
  });
} else {
  installFinalFichaOverrides();
  ensureAuthPanel();
  ensureAuthHomeControls();
  updateAuthStatus();
}

supa.auth.onAuthStateChange(function() {
  updateAuthStatus();
});

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
window.showLogin = showLogin;
window.loginSupabase = loginSupabase;
window.registerSupabase = registerSupabase;
window.logoutSupabase = logoutSupabase;
window.updateAuthStatus = updateAuthStatus;
window.current = current;