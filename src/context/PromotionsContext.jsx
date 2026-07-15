import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { BRAND } from '../config/brand';

const DEFAULT_SETTINGS = {
  sectionEnabled: true,
  pageTitle: 'Promociones',
  pageSubtitle: `Ofertas exclusivas en ${BRAND.name}`,
  menuLabel: 'Promociones',
};

const FALLBACK_ITEMS = [
  {
    id: 'fallback-1',
    title: 'Lociones originales',
    subtitle: 'Selección premium con descuento especial esta semana',
    badge: '-20%',
    priceBefore: 350000,
    priceNow: 280000,
    image: '',
  },
  {
    id: 'fallback-2',
    title: 'Combo moda urbana',
    subtitle: 'Piezas seleccionadas con precio especial',
    badge: '-15%',
    priceBefore: 420000,
    priceNow: 357000,
    image: '',
  },
  {
    id: 'fallback-3',
    title: 'Novedades de temporada',
    subtitle: 'Lo más nuevo con precio de lanzamiento',
    badge: '-25%',
    priceBefore: 480000,
    priceNow: 360000,
    image: '',
  },
];

const PromotionsContext = createContext(null);

function normalizePageData(data) {
  if (Array.isArray(data)) {
    return {
      settings: { ...DEFAULT_SETTINGS },
      items: data.length > 0 ? data : FALLBACK_ITEMS,
    };
  }

  const settings = { ...DEFAULT_SETTINGS, ...(data?.settings || {}) };
  const items =
    Array.isArray(data?.items) && data.items.length > 0
      ? data.items
      : settings.sectionEnabled
        ? FALLBACK_ITEMS
        : [];

  return { settings, items };
}

export function PromotionsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPromotions();
      const normalized = normalizePageData(data);
      setSettings(normalized.settings);
      setItems(normalized.items);
    } catch {
      setSettings(DEFAULT_SETTINGS);
      setItems(FALLBACK_ITEMS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  useEffect(() => {
    const onFocus = () => loadPromotions();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadPromotions();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    const interval = setInterval(loadPromotions, 15000);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(interval);
    };
  }, [loadPromotions]);

  return (
    <PromotionsContext.Provider
      value={{ settings, items, loading, reloadPromotions: loadPromotions }}
    >
      {children}
    </PromotionsContext.Provider>
  );
}

export function usePromotions() {
  const ctx = useContext(PromotionsContext);
  if (!ctx) {
    throw new Error('usePromotions debe usarse dentro de PromotionsProvider');
  }
  return ctx;
}

export { FALLBACK_ITEMS, DEFAULT_SETTINGS };
