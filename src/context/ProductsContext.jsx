import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../api/client';
import { products as staticProducts, NAV_BRANDS as staticBrands } from '../data';
import { getFashionBrands, getFragranceBrands } from '../utils/brands';
import { readCatalogCache, writeCatalogCache } from '../utils/catalogCache';

const ProductsContext = createContext(null);
const REFRESH_MS = 90000;
const RETRY_DELAYS_MS = [0, 1500, 4000];
const PRODUCTION_API = 'https://tienda-1-7f8f.onrender.com';

const initialCache = readCatalogCache();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(fetcher) {
  let lastError;
  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) await sleep(delay);
    try {
      return await fetcher();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

function wakeBackend() {
  if (import.meta.env.DEV) return;
  fetch(`${PRODUCTION_API}/api/health`, { mode: 'cors' }).catch(() => {});
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(initialCache?.products ?? []);
  const [allBrands, setAllBrands] = useState(
    initialCache?.brands?.length
      ? initialCache.brands.map((b) => ({ name: b.name, slug: b.slug }))
      : staticBrands
  );
  const [loading, setLoading] = useState(!initialCache);
  const [initialLoadDone, setInitialLoadDone] = useState(Boolean(initialCache));
  const [usingApi, setUsingApi] = useState(Boolean(initialCache));
  const [apiError, setApiError] = useState(null);

  const fashionBrands = useMemo(() => getFashionBrands(allBrands), [allBrands]);
  const fragranceBrands = useMemo(() => getFragranceBrands(products), [products]);

  const loadProducts = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setApiError(null);

    try {
      const [apiProducts, apiBrands] = await fetchWithRetry(() =>
        Promise.all([api.getProducts(), api.getBrands().catch(() => staticBrands)])
      );
      setProducts(apiProducts);
      const normalizedBrands = apiBrands?.length
        ? apiBrands.map((b) => ({ name: b.name, slug: b.slug }))
        : null;
      if (normalizedBrands?.length) {
        setAllBrands(normalizedBrands);
      }
      writeCatalogCache(apiProducts, normalizedBrands || staticBrands);
      setUsingApi(true);
    } catch (err) {
      const cached = readCatalogCache();
      if (cached?.products?.length) {
        setProducts(cached.products);
        if (cached.brands?.length) {
          setAllBrands(cached.brands.map((b) => ({ name: b.name, slug: b.slug })));
        }
        setUsingApi(true);
      } else if (import.meta.env.DEV) {
        setProducts(staticProducts);
        setAllBrands(staticBrands);
        setUsingApi(false);
      } else {
        setApiError(err.message || 'No se pudo cargar el catálogo');
      }
    } finally {
      if (!silent) setLoading(false);
      setInitialLoadDone(true);
    }
  }, []);

  useEffect(() => {
    wakeBackend();
    loadProducts({ silent: Boolean(initialCache) });
  }, [loadProducts]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadProducts({ silent: true });
    };
    document.addEventListener('visibilitychange', onVisibility);
    const interval = setInterval(() => loadProducts({ silent: true }), REFRESH_MS);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(interval);
    };
  }, [loadProducts]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        brands: fashionBrands,
        fashionBrands,
        fragranceBrands,
        loading: loading || !initialLoadDone,
        usingApi,
        apiError,
        reloadProducts: loadProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
}
