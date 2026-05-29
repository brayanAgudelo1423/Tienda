export function getCartItemId(product) {
  return `${product.id}-${product.selectedSize}-${product.selectedColor}`;
}

export function getBrandBySlug(brands, slug) {
  return brands.find((b) => b.slug === slug)?.name ?? null;
}
