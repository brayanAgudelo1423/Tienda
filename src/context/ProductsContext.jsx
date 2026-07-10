import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../api/client';
import { products as staticProducts, NAV_BRANDS as staticBrands } from '../data';
import { getFashionBrands, getFragranceBrands } from '../utils/brands';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [allBrands, setAllBrands] = useState(staticBrands);
  const [loading, setLoading] = useState(true);
  const [usingApi, setUsingApi] = useState(false);

  const fashionBrands = useMemo(() => getFashionBrands(allBrands), [allBrands]);
  const fragranceBrands = useMemo(() => getFragranceBrands(products), [products]);

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const [apiProducts, apiBrands] = await Promise.all([
        api.getProducts(),
        api.getBrands().catch(() => staticBrands),
      ]);
      setProducts(apiProducts);
      if (apiBrands?.length) {
        setAllBrands(apiBrands.map((b) => ({ name: b.name, slug: b.slug })));
      }
      setUsingApi(true);
    } catch {
      setProducts(staticProducts);
      setAllBrands(staticBrands);
      setUsingApi(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const onFocus = () => loadProducts();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadProducts();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    const interval = setInterval(loadProducts, 30000);
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
