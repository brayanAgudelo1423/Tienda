/** Texto visible en la tienda (normaliza nombres legacy). */
export function displayStoreText(text) {
  return String(text ?? '')
    .replace(/\bOZONO\b/gi, 'VirtusMonaco')
    .replace(/\bOzono\b/g, 'VirtusMonaco')
    .replace(/\bTomi\b/gi, 'Tommy');
}
