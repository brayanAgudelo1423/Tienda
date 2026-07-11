export function getCartItemId(product) {
  if (product.isPromotion || product.promotionId != null) {
    return `promo-${product.promotionId ?? product.id}`;
  }
  return `${product.id}-${product.selectedSize}-${product.selectedColor}`;
}

export function getBrandBySlug(brands, slug) {
  return brands.find((b) => b.slug === slug)?.name ?? null;
}
