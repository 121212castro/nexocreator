// NexoCreator app · flujo Supabase limpio
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

function $(id) {
  return document.getElementById(id);
}

function hideAll() {
  ['home', 'newMenu', 'editor', 'list', 'preview', 'authPanel'].forEach(function(id) {
    const el = $(id);
    if (el) el.classList.add('hidden');
  });
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"]/g, function(match) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[match];
  });
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
  }[value] || value || 'Sin categoría';
}

function normalizeDraft(draft) {
  draft = draft || {};
  draft.id = draft.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  draft.status = draft.status || STATUS.DRAFT;
  draft.category = draft.category || 'pez_marino';
  draft.common_name = draft.common_name || draft.commonName || '';
  draft.scientific_name = draft.scientific_name || draft.scientificName || '';
  draft.cover_image = draft.cover_image || draft.coverImage || '';
  draft.species_photo = draft.species_photo || draft.speciesPhoto || '';
  draft.created_at = draft.created_at || new Date().toISOString();
  draft.updated_at = draft.updated_at || new Date().toISOString();
  draft.sections = draft.sections || {};
  return draft;
}

function rowToDraft(row) {
  const base = normalizeDraft(row && row.ficha_json ? row.ficha_json : {});
  if (row) {
    base.id = row.id || base.id;
    base.status = row.status || base.status;
    base.category = row.category || base.category;
    base.common_name = row.common_name || base.common_name;
    base.scientific_name = row.scientific_name || base.scientific_name;
    base.cover_image = row.cover_image || base.cover_image || '';
    base.created_at = row.created_at || base.created_at;
    base.updated_at = row.updated_at || base.updated_at;
  }
  base.sections = base.sections || {};
  return base;
}

function newDraft() {
  return normalizeDraft({
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
  });
}

function goHome() {
  hideAll();
  if ($('home')) $('home').classList.remove('hidden');
  updateAuthStatus();
}

function showNew() {
  hideAll();
  if ($('newMenu')) $('newMenu').classList.remove('hidden');
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
  current = normalizeDraft(draft);
  window.current = current;
  hideAll();
  $('editor').classList.remove('hidden');
  $('category').value = current.category || 'pez_marino';
  $('commonName').value = current.common_name || '';
  $('scientificName').value = current.scientific_name || '';
  const s = current.sections || {};
  $('summary').value = s.summary || '';
  $('habitat').value = s.habitat || '';
  $('aquarium').value = s.aquarium || '';
  $('feeding').value = s.feeding || '';
  $('compatibility').value = s.compatibility || '';
  $('health').value = s.health || '';
  $('purchase').value = s.purchase || '';
  $('mistakes').value = s.mistakes || '';
  $('curiosities').value = s.curiosities || '';
  $('sources').value = s.sources || '';
  renderCover();
}

function renderCover() {
  const box = $('coverBox');
  if (!box) return;
  box.innerHTML = current && current.cover_image
    ? '<img class="cover" src="' + current.cover_image + '" alt="portada">'
    : '<div class="placeholder">Sin foto de portada</div>';
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
  current = normalizeDraft(current);
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

async function all() {
  const result = await supa
    .from('fichas_creator')
    .select('*')
    .neq('status', STATUS.SENT)
    .order('updated_at', { ascending: false });

  if (result.error) {
    console.error('Error leyendo fichas_creator:', result.error);
    alert('No se pudieron cargar las fichas: ' + (result.error.message || JSON.stringify(result.error)));
    return [];
  }

  return (result.data || []).map(rowToDraft).filter(function(draft) {
    return draft.status !== STATUS.SENT;
  });
}

async function saveFicha(draft) {
  draft = normalizeDraft(draft);
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

  const result = await supa
    .from('fichas_creator')
    .upsert(payload, { onConflict: 'id' });

  if (result.error) {
    console.error('Error guardando ficha:', result.error);
    alert('No se pudo guardar la ficha: ' + (result.error.message || JSON.stringify(result.error)));
    return null;
  }
  return draft;
}

async function saveDraft() {
  const draft = collect();
  const saved = await saveFicha(draft);
  if (saved) alert('Ficha guardada');
}

async function saveDraftAndShowList() {
  const draft = collect();
  const saved = await saveFicha(draft);
  if (saved) await showList();
}

function finalSpeciesPhoto(draft) {
  return draft.species_photo || draft.speciesPhoto ||
    (draft.media && (draft.media.species_photo || draft.media.speciesPhoto)) ||
    (draft.images && (draft.images.species_photo || draft.images.speciesPhoto)) || '';
}

function finalSection(title, content) {
  if (!content) return '';
  return '<section class="section fichaFinalSection"><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(content).replace(/\n/g, '<br>') + '</p></section>';
}

function renderFichaFinal(draft) {
  draft = normalizeDraft(draft);
  const s = draft.sections || {};
  const speciesPhoto = finalSpeciesPhoto(draft);
  return '' +
    '<article class="fichaFinal">' +
      (speciesPhoto ? '<img class="cover" src="' + speciesPhoto + '" alt="foto real de la especie">' : '<div class="placeholder">Sin foto de especie</div>') +
      '<h1>' + escapeHtml(draft.common_name || 'Ficha sin nombre') + '</h1>' +
      '<div class="scientific">' + escapeHtml(draft.scientific_name || '') + '</div>' +
      '<p class="muted">' + escapeHtml(labelCat(draft.category)) + ' · Estado: ' + escapeHtml(labelStatus(draft.status)) + '</p>' +
      finalSection('Resumen rápido', s.summary) +
      finalSection('Hábitat natural', s.habitat) +
      finalSection('Acuario recomendado', s.aquarium) +
      finalSection('Alimentación', s.feeding) +
      finalSection('Compatibilidad', s.compatibility) +
      finalSection('Salud', s.health) +
      finalSection('Antes de comprar', s.purchase) +
      finalSection('Errores frecuentes', s.mistakes) +
      finalSection('Curiosidades', s.curiosities) +
      finalSection('Fuentes', s.sources) +
    '</article>';
}

function transitionButtons(draft) {
  if (draft.status === STATUS.SENT) return '<button class="small" disabled>✅ Ya enviada a AcuarioNexo</button>';
  return '<button class="primary" onclick="sendToAcuarioNexo()">📲 Pasar a AcuarioNexo</button>';
}

async function openFinalById(id) {
  const result = await supa
    .from('fichas_creator')
    .select('*')
    .eq('id', id)
    .limit(1);

  const row = (result.data || [])[0];
  if (result.error || !row) {
    alert('No se pudo abrir la ficha: ' + ((result.error && result.error.message) || 'sin datos'));
    return;
  }

  const draft = rowToDraft(row);
  current = draft;
  window.current = draft;
  hideAll();
  $('preview').innerHTML =
    '<button class="small" onclick="showList()">← Mis fichas</button>' +
    renderFichaFinal(draft) +
    '<button class="primary" onclick="openEditor(window.current)">✏️ Editar ficha</button>' +
    transitionButtons(draft) +
    '<button class="small danger" onclick="deleteFicha(\'' + draft.id + '\')">🗑️ Borrar</button>';
  $('preview').classList.remove('hidden');
}

async function showList() {
  hideAll();
  $('list').innerHTML = '<h2>Mis fichas</h2><p class="muted">Cargando...</p>';
  $('list').classList.remove('hidden');

  const arr = await all();
  let html = '<h2>Mis fichas</h2>';
  if (!arr.length) html += '<p class="muted">Aún no hay fichas guardadas.</p>';

  arr.forEach(function(f) {
    const cover = f.cover_image
      ? '<img class="listCover" src="' + f.cover_image + '" alt="portada">'
      : '<div class="listCoverEmpty">Sin portada</div>';

    html += '' +
      '<div class="listItem">' +
        '<div onclick="openFinalById(\'' + f.id + '\')">' +
          cover +
          '<div class="listBody">' +
            '<h3>' + escapeHtml(f.common_name || 'Sin nombre') + '</h3>' +
            '<p class="muted">' + escapeHtml(f.scientific_name || '') + '</p>' +
            '<p class="muted">' + escapeHtml(labelCat(f.category)) + ' · ' + escapeHtml(labelStatus(f.status)) + '</p>' +
            '<button class="primary small" onclick="event.stopPropagation();openFinalById(\'' + f.id + '\')">Ver ficha final</button>' +
            '<button class="small danger" onclick="event.stopPropagation();deleteFicha(\'' + f.id + '\')">🗑️ Borrar</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  html += '<button class="small" onclick="goHome()">← Volver</button>';
  $('list').innerHTML = html;
}

function showPreview() {
  const draft = collect();
  hideAll();
  $('preview').innerHTML =
    '<button class="small" onclick="openEditor(window.current)">← Editar</button>' +
    renderFichaFinal(draft) +
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
  const draft = (window.current && window.current.id) ? normalizeDraft(window.current) : collect();
  const s = draft.sections || {};
  const title = draft.common_name || draft.scientific_name || '';

  if (!title) {
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
    description: s.summary || null,
    photo_url: finalSpeciesPhoto(draft) || null,
    feeding: s.feeding || null,
    compatibility: s.compatibility || null,
    references_text: s.sources || null,
    parameters: {},
    updated_at: new Date().toISOString()
  };

  let existing = null;
  if (draft.scientific_name) {
    const found = await supa.from('library_entries').select('id').eq('user_id', user.id).eq('scientific_name', draft.scientific_name).limit(1);
    if (found.error) {
      alert('No se pudo comprobar si la ficha ya existe en AcuarioNexo: ' + found.error.message);
      return;
    }
    existing = (found.data || [])[0] || null;
  }

  if (!existing) {
    const found = await supa.from('library_entries').select('id').eq('user_id', user.id).eq('title', title).limit(1);
    if (found.error) {
      alert('No se pudo comprobar si la ficha ya existe en AcuarioNexo: ' + found.error.message);
      return;
    }
    existing = (found.data || [])[0] || null;
  }

  const result = existing
    ? await supa.from('library_entries').update(libraryRow).eq('id', existing.id)
    : await supa.from('library_entries').insert(libraryRow);

  if (result.error) {
    alert('No se pudo pasar la ficha a AcuarioNexo: ' + result.error.message);
    return;
  }

  draft.status = STATUS.SENT;
  draft.sent_to_acuarionexo_at = new Date().toISOString();
  await saveFicha(draft);
  current = draft;
  window.current = draft;
  alert('Ficha pasada a AcuarioNexo');
  showList();
}

async function sendToReview() { return sendToAcuarioNexo(); }
async function validateCurrent() { return sendToAcuarioNexo(); }

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
  (document.querySelector('.app') || document.body).appendChild(panel);
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
  const result = await supa.auth.getUser();
  const user = result && result.data && result.data.user;
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
  const result = await supa.auth.signInWithPassword({ email: email, password: password });
  if (result.error) {
    if (msg) msg.textContent = 'No se pudo iniciar sesión: ' + result.error.message;
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
  const result = await supa.auth.signUp({ email: email, password: password });
  if (result.error) {
    if (msg) msg.textContent = 'No se pudo crear la cuenta: ' + result.error.message;
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
    ensureAuthPanel();
    ensureAuthHomeControls();
    updateAuthStatus();
  });
} else {
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
window.openById = openFinalById;
window.openFinalById = openFinalById;
window.startFromPhoto = startFromPhoto;
window.removeCover = removeCover;
window.renderCover = renderCover;
window.replaceCover = replaceCover;
window.all = all;
window.saveFicha = saveFicha;
window.saveDraft = saveDraft;
window.saveDraftAndShowList = saveDraftAndShowList;
window.showPreview = showPreview;
window.exportCurrent = exportCurrent;
window.showList = showList;
window.renderFichaFinal = renderFichaFinal;
window.sendToAcuarioNexo = sendToAcuarioNexo;
window.sendToReview = sendToReview;
window.validateCurrent = validateCurrent;
window.labelCat = labelCat;
window.labelStatus = labelStatus;
window.escapeHtml = escapeHtml;
window.showLogin = showLogin;
window.loginSupabase = loginSupabase;
window.registerSupabase = registerSupabase;
window.logoutSupabase = logoutSupabase;
window.updateAuthStatus = updateAuthStatus;
