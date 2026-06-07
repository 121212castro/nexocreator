// Compresión automática de imágenes para NexoCreator.
// Mantiene el flujo normal: el usuario elige foto desde móvil/cámara y la app guarda una versión ligera.
(function() {
  const MAX_IMAGE_SIZE = 1200;
  const JPEG_QUALITY = 0.8;

  function readAsDataUrl(file) {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onload = function() { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise(function(resolve, reject) {
      const img = new Image();
      img.onload = function() { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }

  function targetSize(width, height) {
    const longest = Math.max(width, height);
    if (longest <= MAX_IMAGE_SIZE) return { width: width, height: height };
    const ratio = MAX_IMAGE_SIZE / longest;
    return {
      width: Math.round(width * ratio),
      height: Math.round(height * ratio)
    };
  }

  async function compressImage(file) {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return readAsDataUrl(file);
    }

    const originalDataUrl = await readAsDataUrl(file);
    const img = await loadImage(originalDataUrl);
    const size = targetSize(img.naturalWidth || img.width, img.naturalHeight || img.height);

    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size.width, size.height);

    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  }

  // Sustituye la función global usada por startFromPhoto() y replaceCover().
  window.readFile = compressImage;
  try {
    readFile = compressImage;
  } catch (err) {
    console.warn('No se pudo reasignar readFile global:', err);
  }
})();
