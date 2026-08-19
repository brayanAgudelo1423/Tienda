const CACHE_KEY = 'ozono_catalog_v2';
const CACHE_TTL_MS = 15 * 60 * 1000;

export function readCatalogCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { products, brands, ts } = JSON.parse(raw);
    if (!Array.isArray(products) || !products.length || Date.now() - ts > CACHE_TTL_MS) {
      return null;
    }
    return {
      products: products.filter((p) => !p.sold),
      brands: Array.isArray(brands) ? brands : null,
    };
  } catch {
    return null;
  }
}

export function writeCatalogCache(products, brands) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        products: products.filter((p) => !p.sold),
        brands,
        ts: Date.now(),
      })
    );
  } catch {
    /* quota or private mode */
  }
}

export function clearCatalogCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

export function removeProductsFromCache(productIds) {
  const cached = readCatalogCache();
  if (!cached) return;
  const ids = new Set(productIds.map(Number));
  writeCatalogCache(
    cached.products.filter((p) => !ids.has(p.id)),
    cached.brands
  );
}
