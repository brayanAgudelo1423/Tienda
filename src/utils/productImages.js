/** Imágenes únicas para la ficha del producto (principal + hover + galería). */
export function getProductGalleryImages(product) {
  if (!product) return [];

  const urls = [];
  const seen = new Set();

  const add = (url) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    urls.push(url);
  };

  add(product.image);
  if (product.hoverImage && product.hoverImage !== product.image) {
    add(product.hoverImage);
  }
  if (Array.isArray(product.gallery)) {
    product.gallery.forEach(add);
  }

  return urls;
}
