// NexoCreator · portada marina por defecto en el editor
(function() {
  const BASE_COVER = 'assets/plantillas/PLANTILLA_MARINA_PREMIUM_BASE.svg';
  const DEFAULT_COVER = BASE_COVER + '?v=20260608-1736';
  const MARINE_CATEGORIES = ['pez_marino', 'coral', 'invertebrado'];
  const SYSTEM_COVER_MARKERS = [
    'PLANTILLA_MARINA_PREMIUM_BASE.svg',
    'PORTADA_MARINA_DEFAULT.svg',
    'PORTADA_MARINA',
    'marine-cover',
    'waterGlow',
    'coralGlow',
    'data:image/svg+xml'
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
    location.href = location.pathname + '?v=20260608-1736';
  };

  applyDefaultCover(window.current);
})();
