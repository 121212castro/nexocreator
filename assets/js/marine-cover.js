// NexoCreator · portadas marinas automáticas
(function() {
  const MARINE_CATEGORIES = ['pez_marino', 'coral', 'invertebrado'];
  const MARINE_BACKGROUND = 'assets/plantillas/PLANTILLA_MARINA_PREMIUM_BASE.svg';

  function esc(value) {
    if (window.escapeHtml) return window.escapeHtml(value || '');
    return String(value || '').replace(/[&<>\"]/g, function(match) {
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
    const categoryLabel = labelCategory(draft.category || '');
    return '' +
      '<section class="nexoMarineCover" aria-label="Portada marina">' +
        '<img class="nexoMarineCoverBg" src="' + MARINE_BACKGROUND + '" alt="Fondo marino">' +
        '<div class="nexoMarineCoverShade"></div>' +
        '<div class="nexoMarineCoverBadge">' + esc(categoryLabel) + '</div>' +
        '<div class="nexoMarineCoverPhotoWrap">' +
          (speciesPhoto ? '<img class="nexoMarineCoverAnimal" src="' + speciesPhoto + '" alt="foto real de la especie">' : '<div class="nexoMarineCoverAnimalEmpty">Sin foto real</div>') +
        '</div>' +
        '<div class="nexoMarineCoverText">' +
          '<h1>' + esc(draft.common_name || 'Ficha sin nombre') + '</h1>' +
          '<p>' + esc(draft.scientific_name || '') + '</p>' +
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
})();
