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
