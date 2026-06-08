// NexoCreator · portada marina por defecto en el editor
(function() {
  const DEFAULT_COVER = 'assets/plantillas/PLANTILLA_MARINA_PREMIUM_BASE.svg';
  const MARINE_CATEGORIES = ['pez_marino', 'coral', 'invertebrado'];

  function isMarine(category) {
    return MARINE_CATEGORIES.indexOf(category) !== -1;
  }

  function isDefaultCover(value) {
    return value === DEFAULT_COVER;
  }

  function applyDefaultCover(draft) {
    if (!draft) return draft;
    if (isMarine(draft.category) && !draft.cover_image) draft.cover_image = DEFAULT_COVER;
    return draft;
  }

  function clearDefaultCoverForNonMarine(draft) {
    if (!draft) return draft;
    if (!isMarine(draft.category) && isDefaultCover(draft.cover_image)) draft.cover_image = '';
    return draft;
  }

  const originalNewDraft = window.newDraft;
  if (typeof originalNewDraft === 'function') {
    window.newDraft = function(category) {
      return applyDefaultCover(originalNewDraft(category));
    };
  }

  const originalOpenEditor = window.openEditor;
  if (typeof originalOpenEditor === 'function') {
    window.openEditor = function(draft) {
      return originalOpenEditor(applyDefaultCover(draft));
    };
  }

  const originalChangeCategory = window.changeCategory;
  if (typeof originalChangeCategory === 'function') {
    window.changeCategory = function() {
      const previousCover = window.current && window.current.cover_image;
      const result = originalChangeCategory();
      if (window.current) {
        if (!previousCover || isDefaultCover(previousCover)) {
          window.current.cover_image = isMarine(window.current.category) ? DEFAULT_COVER : '';
        }
        clearDefaultCoverForNonMarine(window.current);
        if (typeof window.renderCover === 'function') window.renderCover();
      }
      return result;
    };
  }

  const originalRemoveCover = window.removeCover;
  if (typeof originalRemoveCover === 'function') {
    window.removeCover = function() {
      if (window.current && isMarine(window.current.category)) {
        window.current.cover_image = DEFAULT_COVER;
        if (typeof window.renderCover === 'function') window.renderCover();
        return;
      }
      return originalRemoveCover();
    };
  }

  applyDefaultCover(window.current);
})();
