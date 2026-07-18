/** Texto visible en la tienda (normaliza nombres legacy). */
export function displayStoreText(text) {
  return String(text ?? '').replace(/\bTomi\b/gi, 'Tommy');
}
