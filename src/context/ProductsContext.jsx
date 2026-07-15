import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { products as staticProducts, NAV_BRANDS as staticBrands } from '../data';
import { getFashionBrands, getFragranceBrands } from '../utils/brands';

const ProductsContext = createContext(null);
const REFRESH_MS = 15000;
const RETRY_DELAYS_MS = [0, 2000, 5000];

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

export function ProductsProvider({ children }) {
  const { pathname } = useLocation();
  const [products, setProducts] = useState([]);
  const [allBrands, setAllBrands] = useState(staticBrands);
  const [loading, setLoading] = useState(true);
  const [usingApi, setUsingApi] = useState(false);
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
      if (apiBrands?.length) {
        setAllBrands(apiBrands.map((b) => ({ name: b.name, slug: b.slug })));
      }
      setUsingApi(true);
    } catch (err) {
      if (import.meta.env.DEV) {
        setProducts(staticProducts);
        setAllBrands(staticBrands);
        setUsingApi(false);
      } else {
        setApiError(err.message || 'No se pudo cargar el catálogo');
        setUsingApi((prev) => prev);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, pathname]);

  useEffect(() => {
    const onFocus = () => loadProducts({ silent: true });
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadProducts({ silent: true });
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    const interval = setInterval(() => loadProducts({ silent: true }), REFRESH_MS);
    return () => {
      window.removeEventListener('focus', onFocus);
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
        loading,
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
