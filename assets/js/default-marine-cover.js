// NexoCreator · portada marina por defecto en el editor
(function() {
  const BASE_COVER = 'assets/plantillas/PLANTILLA_MARINA_PREMIUM_BASE.svg';
  const DEFAULT_COVER = 'data:image/jpeg;base64,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';
  const MARINE_CATEGORIES = ['pez_marino', 'coral', 'invertebrado'];
  const SYSTEM_COVER_MARKERS = [
    'PLANTILLA_MARINA_PREMIUM_BASE.svg',
    'PORTADA_MARINA_DEFAULT.svg',
    'PORTADA_MARINA',
    'marine-cover',
    'waterGlow',
    'coralGlow',
    'data:image/svg+xml',
    'assets/plantillas/'
  ];

  function isMarine(category) {
    return MARINE_CATEGORIES.indexOf(category) !== -1;
  }

  function cleanCover(value) {
    return String(value || '').split('?')[0];
  }

  function isSystemCover(value) {
    if (!value) return true;
    const text = String(value);
    if (text === DEFAULT_COVER) return true;
    if (cleanCover(text) === BASE_COVER) return true;
    return SYSTEM_COVER_MARKERS.some(function(marker) {
      return text.indexOf(marker) !== -1;
    });
  }

  function applyDefaultCover(draft) {
    if (!draft) return draft;
    if (isMarine(draft.category) && isSystemCover(draft.cover_image)) {
      draft.cover_image = DEFAULT_COVER;
    }
    return draft;
  }

  function clearDefaultCoverForNonMarine(draft) {
    if (!draft) return draft;
    if (!isMarine(draft.category) && isSystemCover(draft.cover_image)) draft.cover_image = '';
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
        if (isSystemCover(previousCover) || isSystemCover(window.current.cover_image)) {
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

  const originalCollect = window.collect;
  if (typeof originalCollect === 'function') {
    window.collect = function(updateTime) {
      return applyDefaultCover(originalCollect(updateTime));
    };
  }

  window.refreshApp = async function() {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(function(registration) {
        return registration.unregister();
      }));
    }
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map(function(key) { return caches.delete(key); }));
    }
    location.href = location.pathname + '?v=20260608-1740';
  };

  applyDefaultCover(window.current);
})();
