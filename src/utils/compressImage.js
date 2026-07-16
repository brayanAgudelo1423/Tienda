const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;
const MAX_OUTPUT_BYTES = 900 * 1024;
const SKIP_BELOW_BYTES = 400 * 1024;

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo comprimir la imagen'))),
      'image/jpeg',
      quality
    );
  });
}

/**
 * Reduce peso y tamaño antes de subir al servidor.
 * Una foto de 5–8 MB suele quedar en ~200–800 KB.
 */
export async function compressImageForUpload(file) {
  if (!file?.type?.startsWith('image/')) return file;
  if (file.size <= SKIP_BELOW_BYTES && !/heic|heif/i.test(file.type)) return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);

    let quality = JPEG_QUALITY;
    let blob = await canvasToBlob(canvas, quality);
    while (blob.size > MAX_OUTPUT_BYTES && quality > 0.52) {
      quality -= 0.08;
      blob = await canvasToBlob(canvas, quality);
    }

    const baseName = (file.name || 'producto').replace(/\.[^.]+$/, '') || 'producto';
    return new File([blob], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close?.();
  }
}
