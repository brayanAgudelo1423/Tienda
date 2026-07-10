import { FRAGRANCE_BRANDS, LOCIONES_CATEGORY } from '../constants/catalog.js';
import { NAV_BRANDS } from '../data.js';

const FRAGRANCE_SLUGS = new Set(FRAGRANCE_BRANDS.map((b) => b.slug));
const FASHION_SLUGS = new Set(NAV_BRANDS.map((b) => b.slug));

export function isFragranceBrandSlug(slug) {
  return FRAGRANCE_SLUGS.has(slug);
}

/** Marcas de moda para el menú principal (sin perfumería). */
export function getFashionBrands(allBrands = NAV_BRANDS) {
  const bySlug = new Map(allBrands.map((b) => [b.slug, b]));
  return NAV_BRANDS.map((b) => bySlug.get(b.slug) || b);
}

/** Marcas de lociones derivadas del catálogo activo. */
export function getFragranceBrands(products) {
  const names = [
    ...new Set(
      products.filter((p) => p.category === LOCIONES_CATEGORY).map((p) => p.brand)
    ),
  ].sort((a, b) => a.localeCompare(b, 'es'));

  if (names.length === 0) return FRAGRANCE_BRANDS;

  return names.map((name) => {
    const known = FRAGRANCE_BRANDS.find((b) => b.name === name);
    if (known) return known;
    return {
      name,
      slug: name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    };
  });
}

export function getBrandNameBySlug(brands, slug) {
  return brands.find((b) => b.slug === slug)?.name ?? null;
}

/** Quita marcas de perfumería de una lista genérica de marcas. */
export function withoutFragranceBrands(allBrands) {
  return allBrands.filter((b) => !FRAGRANCE_SLUGS.has(b.slug) && FASHION_SLUGS.has(b.slug));
}
