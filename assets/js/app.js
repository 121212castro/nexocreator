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
    category: 'pez_marino',
    common_name: '',
    scientific_name: '',
    cover_image: '',
    sections: {}
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

  return draft;
}

function openEditor(draft) {
  current = draft;
  hideAll();
  $('editor').classList.remove('hidden');
  renderCover();
}

function renderCover() {
  const box = $('coverBox');
  if (!box) return;

  if (current && current.cover_image) {
    box.innerHTML = '<img class="cover" src="' + current.cover_image + '">';
    return;
  }

  box.innerHTML = '<div class="placeholder">Sin foto de portada</div>';
}

async function replaceCover(ev) {
  const file = ev.target.files[0];
  if (!file || !current) return;

  current.cover_image = await readFile(file);
  renderCover();
}

function removeCover() {
  if (!current) return;

  current.cover_image = '';
  renderCover();
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