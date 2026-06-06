// Recupera fichas antiguas guardadas en este dispositivo antes de migrar a Supabase.
(function() {
  const KEY = 'nexocreator_fichas_v1';
  const SENT = 'ENVIADA_A_ACUARIONEXO';

  function readLocal() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (err) {
      console.warn('No se pudieron leer fichas locales antiguas', err);
      return [];
    }
  }

  function normalize(draft) {
    if (!draft) return null;
    draft.id = draft.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
    draft.status = draft.status || 'BORRADOR';
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

  function writeLocal(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function upsertLocal(draft) {
    const arr = readLocal();
    const index = arr.findIndex(function(item) { return item && item.id === draft.id; });
    if (index >= 0) arr[index] = draft;
    else arr.unshift(draft);
    writeLocal(arr);
  }

  const previousAll = window.all;
  window.all = async function() {
    const remote = previousAll ? await previousAll() : [];
    const local = readLocal().map(normalize).filter(function(draft) {
      return draft && draft.status !== SENT;
    });

    const byId = {};
    remote.forEach(function(draft) { if (draft && draft.id) byId[draft.id] = draft; });
    local.forEach(function(draft) { if (draft && draft.id && !byId[draft.id]) byId[draft.id] = draft; });

    return Object.keys(byId).map(function(id) { return byId[id]; }).sort(function(a, b) {
      return String(b.updated_at || '').localeCompare(String(a.updated_at || ''));
    });
  };

  const previousSaveFicha = window.saveFicha;
  window.saveFicha = async function(draft) {
    draft = normalize(draft);
    upsertLocal(draft);
    if (previousSaveFicha) return previousSaveFicha(draft);
    return draft;
  };

  const previousOpenFinalById = window.openFinalById;
  window.openFinalById = async function(id) {
    const local = readLocal().map(normalize).find(function(item) {
      return item && item.id === id;
    });

    if (local) {
      window.current = local;
      if (typeof current !== 'undefined') current = local;
      if (typeof hideAll === 'function') hideAll();
      const preview = document.getElementById('preview');
      if (preview && typeof renderFichaFinal === 'function') {
        preview.innerHTML =
          '<button class="small" onclick="showList()">← Mis fichas</button>' +
          renderFichaFinal(local) +
          '<button class="primary" onclick="openEditor(window.current)">✏️ Editar ficha</button>' +
          (typeof transitionButtons === 'function' ? transitionButtons(local) : '') +
          '<button class="small danger" onclick="deleteFicha(\'' + local.id + '\')">🗑️ Borrar</button>';
        preview.classList.remove('hidden');
        return;
      }
    }

    if (previousOpenFinalById) return previousOpenFinalById(id);
  };
})();
