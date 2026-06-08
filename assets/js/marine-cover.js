// NexoCreator · PLANTILLA_MARINA_PREMIUM_V1
// Plantilla oficial única para pez marino, coral e invertebrado marino.
(function() {
  const MARINE_CATEGORIES = ['pez_marino', 'coral', 'invertebrado'];
  const MARINE_BACKGROUND = 'assets/plantillas/PLANTILLA_MARINA_PREMIUM_BASE.svg';

  function esc(value) {
    if (window.escapeHtml) return window.escapeHtml(value || '');
    return String(value || '').replace(/[&<>"]/g, function(match) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[match];
    });
  }

  function normalize(draft) {
    if (typeof window.normalizeDraft === 'function') return window.normalizeDraft(draft || {});
    return draft || {};
  }

  function labelCategory(value) {
    return window.labelCat ? window.labelCat(value) : value;
  }

  function labelState(value) {
    return window.labelStatus ? window.labelStatus(value) : value;
  }

  function finalSpeciesPhoto(draft) {
    return draft.species_photo || draft.speciesPhoto ||
      (draft.media && (draft.media.species_photo || draft.media.speciesPhoto)) ||
      (draft.images && (draft.images.species_photo || draft.images.speciesPhoto)) || '';
  }

  function finalSection(title, content) {
    if (!content) return '';
    return '<details class="section fichaFinalSection" open><summary>' + esc(title) + '</summary><p>' + esc(content).replace(/\n/g, '<br>') + '</p></details>';
  }

  function categoryDef(value) {
    return (window.CATEGORY_TREE && window.CATEGORY_TREE[value]) || (window.CATEGORY_TREE && window.CATEGORY_TREE.pez_marino) || { sections: [] };
  }

  function marineCover(draft, speciesPhoto) {
    const scientificName = draft.scientific_name || draft.common_name || 'Ficha sin nombre';
    const commonName = draft.common_name || '';

    return '' +
      '<section class="nexoMarineCover plantillaMarinaPremiumV1" aria-label="PLANTILLA_MARINA_PREMIUM_V1">' +
        '<img class="nexoMarineCoverBg" src="' + MARINE_BACKGROUND + '" alt="Fondo reef azul profundo">' +
        '<div class="nexoMarineCoverShade" aria-hidden="true"></div>' +
        '<div class="nexoMarineCoverPhotoWrap">' +
          (speciesPhoto ? '<img class="nexoMarineCoverAnimal" src="' + speciesPhoto + '" alt="imagen principal">' : '<div class="nexoMarineCoverAnimalEmpty">Añade imagen principal</div>') +
        '</div>' +
        '<div class="nexoMarineCoverText">' +
          '<h1 class="nexoMarineCoverScientific">' + esc(scientificName) + '</h1>' +
          '<div class="nexoMarineCoverDivider" aria-hidden="true"></div>' +
          '<p class="nexoMarineCoverCommon">' + esc(commonName) + '</p>' +
        '</div>' +
      '</section>';
  }

  function renderFichaFinalMarine(draft) {
    draft = normalize(draft);
    const s = draft.sections || {};
    const def = categoryDef(draft.category);
    const speciesPhoto = finalSpeciesPhoto(draft);
    const isMarine = MARINE_CATEGORIES.indexOf(draft.category) !== -1;

    let html = '<article class="fichaFinal">';
    if (isMarine) {
      html += marineCover(draft, speciesPhoto);
    } else {
      html += draft.cover_image ? '<img class="cover" src="' + draft.cover_image + '" alt="portada de ficha">' : '<div class="placeholder">Sin foto de portada</div>';
      html += speciesPhoto ? '<img class="cover speciesPhotoFinal" src="' + speciesPhoto + '" alt="foto real de la especie o producto">' : '';
    }
    html += '<h1>' + esc(draft.common_name || 'Ficha sin nombre') + '</h1>';
    html += '<div class="scientific">' + esc(draft.scientific_name || '') + '</div>';
    html += '<p class="muted">' + esc(labelCategory(draft.category)) + ' · Estado: ' + esc(labelState(draft.status)) + '</p>';
    (def.sections || []).forEach(function(item) {
      html += finalSection(item[1], s[item[0]]);
    });
    html += '</article>';
    return html;
  }

  window.renderFichaFinal = renderFichaFinalMarine;

  window.showPreview = function() {
    const draft = typeof window.collect === 'function' ? window.collect() : window.current;
    if (typeof window.hideAll === 'function') window.hideAll();
    const preview = document.getElementById('preview');
    if (!preview) return;
    preview.innerHTML =
      '<button class="small" onclick="openEditor(window.current)">← Editar</button>' +
      renderFichaFinalMarine(draft) +
      (typeof window.transitionButtons === 'function' ? window.transitionButtons(draft) : '');
    preview.classList.remove('hidden');
  };

  const previousOpenFinalById = window.openFinalById;
  window.openFinalById = async function(id) {
    if (!window.supa || typeof window.rowToDraft !== 'function') {
      if (previousOpenFinalById) return previousOpenFinalById(id);
      return;
    }
    const result = await window.supa
      .from('fichas_creator')
      .select('*')
      .eq('id', id)
      .limit(1);
    const row = (result.data || [])[0];
    if (result.error || !row) {
      alert('No se pudo abrir la ficha: ' + ((result.error && result.error.message) || 'sin datos'));
      return;
    }
    const draft = window.rowToDraft(row);
    window.current = draft;
    if (typeof window.hideAll === 'function') window.hideAll();
    const preview = document.getElementById('preview');
    if (!preview) return;
    preview.innerHTML =
      '<button class="small" onclick="showList()">← Mis fichas</button>' +
      renderFichaFinalMarine(draft) +
      '<button class="primary" onclick="openEditor(window.current)">✏️ Editar ficha</button>' +
      (typeof window.transitionButtons === 'function' ? window.transitionButtons(draft) : '') +
      '<button class="small danger" onclick="deleteFicha(\'' + draft.id + '\')">🗑️ Borrar</button>';
    preview.classList.remove('hidden');
  };
})();
