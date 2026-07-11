import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getAllProducts,
  getAllPromotions,
  getPromotionsSettings,
  getBrands,
  getProductCount,
  createProduct,
  createPromotion,
  updatePromotionsSettings,
  upsertBrand,
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getCatalogExportPath() {
  if (process.env.CATALOG_EXPORT_PATH) {
    return path.resolve(process.env.CATALOG_EXPORT_PATH);
  }
  return path.join(__dirname, '..', 'data', 'catalog-export.json');
}

export async function buildCatalogSnapshot() {
  const [products, promotions, promotionsSettings, brands] = await Promise.all([
    getAllProducts(),
    getAllPromotions(),
    getPromotionsSettings(),
    getBrands(),
  ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    products,
    promotions,
    promotionsSettings,
    brands: brands.map((b) => ({
      name: b.name,
      slug: b.slug,
      sortOrder: b.sort_order ?? b.sortOrder ?? 0,
    })),
  };
}

export async function exportCatalogToFile() {
  const snapshot = await buildCatalogSnapshot();
  const exportPath = getCatalogExportPath();
  fs.mkdirSync(path.dirname(exportPath), { recursive: true });
  fs.writeFileSync(exportPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`[OZONO] Catálogo exportado (${snapshot.products.length} productos) → ${exportPath}`);
  return { path: exportPath, snapshot };
}

let exportTimer;
export function scheduleCatalogExport() {
  clearTimeout(exportTimer);
  exportTimer = setTimeout(() => {
    exportCatalogToFile().catch((err) => {
      console.warn('[OZONO] No se pudo exportar catálogo:', err.message);
    });
  }, 800);
}

function readExportFile() {
  const exportPath = getCatalogExportPath();
  if (!fs.existsSync(exportPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  } catch (err) {
    console.warn('[OZONO] catalog-export.json inválido:', err.message);
    return null;
  }
}

export async function importCatalogFromExportIfEmpty() {
  const count = await getProductCount();
  if (count > 0) {
    console.log(`[OZONO] Catálogo ya tiene ${count} productos — no se importa export.`);
    return false;
  }

  const data = readExportFile();
  if (!data?.products?.length) {
    console.log('[OZONO] No hay catalog-export.json con productos.');
    return false;
  }

  console.log(`[OZONO] Importando catálogo desde export (${data.products.length} productos)...`);

  for (const brand of data.brands ?? []) {
    await upsertBrand({
      name: brand.name,
      slug: brand.slug,
      sortOrder: brand.sortOrder ?? 0,
    });
  }

  for (const p of data.products) {
    await createProduct({
      name: p.name,
      brand: p.brand,
      brandSlug: p.brandSlug,
      productType: p.productType,
      price: p.price,
      category: p.category,
      gender: p.gender ?? null,
      rating: p.rating ?? 4.6,
      reviewCount: p.reviewCount ?? 0,
      description: p.description ?? '',
      image: p.image,
      hoverImage: p.hoverImage ?? p.image,
      gallery: p.gallery ?? [],
      sizes: p.sizes ?? [],
      colors: p.colors ?? [],
      active: p.active !== false,
    });
  }

  if (data.promotionsSettings) {
    await updatePromotionsSettings(data.promotionsSettings);
  }

  for (const promo of data.promotions ?? []) {
    await createPromotion({
      title: promo.title,
      subtitle: promo.subtitle ?? '',
      badge: promo.badge ?? '',
      ctaText: promo.ctaText ?? 'Ver más',
      ctaLink: promo.ctaLink ?? '/',
      image: promo.image ?? '',
      priceBefore: promo.priceBefore ?? null,
      priceNow: promo.priceNow ?? null,
      sortOrder: promo.sortOrder ?? 0,
      active: promo.active !== false,
    });
  }

  console.log(`[OZONO] Importación completada (${data.products.length} productos).`);
  return true;
}
