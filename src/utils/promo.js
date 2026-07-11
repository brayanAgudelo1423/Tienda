export function promoDiscountPercent(priceBefore, priceNow) {
  const before = Number(priceBefore);
  const now = Number(priceNow);
  if (!before || !now || before <= now) return null;
  return Math.round((1 - now / before) * 100);
}

export function promoSavings(priceBefore, priceNow) {
  const before = Number(priceBefore);
  const now = Number(priceNow);
  if (!before || !now || before <= now) return 0;
  return before - now;
}

export function resolvePromoBadge(promo) {
  if (promo.badge?.trim()) return promo.badge.trim();
  const pct = promoDiscountPercent(promo.priceBefore, promo.priceNow);
  return pct ? `-${pct}%` : null;
}

export function hasPromoPricing(promo) {
  return Number(promo.priceBefore) > 0 && Number(promo.priceNow) > 0;
}

export function canBuyPromotion(promo) {
  return Number(promo.priceNow) > 0;
}

export function promotionToCartItem(promo) {
  return {
    id: `promo-${promo.id}`,
    promotionId: promo.id,
    isPromotion: true,
    name: promo.title,
    brand: 'Promoción',
    productType: 'Promoción',
    price: Number(promo.priceNow),
    priceBefore: Number(promo.priceBefore) || null,
    image: promo.image || '',
    selectedSize: 'Única',
    selectedColor: 'promo',
    colorName: 'Oferta',
  };
}
