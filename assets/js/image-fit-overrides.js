// Ajustes finales de imagen para evitar recortes por CSS cacheada en iOS/PWA.
(function() {
  const REFRESH_VERSION = '20260612-0155';

  function applyStyles(el, styles) {
    if (!el) return;
    Object.keys(styles).forEach(function(key) {
      el.style[key] = styles[key];
    });
  }

  function normalizeImages() {
    document.querySelectorAll('.listCover, #coverBox .cover, .fichaFinal > .cover:first-child').forEach(function(img) {
      applyStyles(img, {
        width: '100%',
        height: 'auto',
        maxHeight: 'none',
        aspectRatio: 'auto',
        objectFit: 'contain',
        objectPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.18)',
        display: 'block'
      });
    });

    document.querySelectorAll('#speciesPhotoBox .cover, .speciesPhotoFinal').forEach(function(img) {
      applyStyles(img, {
        width: '100%',
        height: 'auto',
        maxHeight: 'none',
        maxWidth: '100%',
        aspectRatio: 'auto',
        objectFit: 'contain',
        objectPosition: 'center',
        backgroundColor: '#fff',
        display: 'block'
      });
    });
  }

  const observer = new MutationObserver(normalizeImages);

  function boot() {
    normalizeImages();
    observer.observe(document.body, { childList: true, subtree: true });
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
    location.href = location.pathname + '?v=' + REFRESH_VERSION;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
