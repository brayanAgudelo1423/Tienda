import React, { useEffect, useMemo, useState } from 'react';
import { BRAND } from '../config/brand';
import { useProducts } from '../context/ProductsContext';
import { usePromotions } from '../context/PromotionsContext';
import { readCatalogCache } from '../utils/catalogCache';
import { forceUnlockPageScroll } from '../utils/scrollLock';

const FADE_MS = 500;
const MIN_VISIBLE_CACHED_MS = 900;
const MIN_VISIBLE_FIRST_MS = 1400;

function removeHtmlBootSplash() {
  document.getElementById('boot-splash')?.remove();
}

const StoreBootSplash = () => {
  const { loading: productsLoading } = useProducts();
  const { loading: promosLoading } = usePromotions();
  const hadCatalogCache = useMemo(() => Boolean(readCatalogCache()?.products?.length), []);
  const minVisibleMs = hadCatalogCache ? MIN_VISIBLE_CACHED_MS : MIN_VISIBLE_FIRST_MS;

  const [logoReady, setLogoReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [phase, setPhase] = useState('visible');

  useEffect(() => {
    removeHtmlBootSplash();
  }, []);

  useEffect(() => {
    const img = new Image();
    const done = () => setLogoReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = BRAND.logo;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), minVisibleMs);
    return () => clearTimeout(timer);
  }, [minVisibleMs]);

  const dataReady = !productsLoading && !promosLoading && logoReady && minElapsed;

  useEffect(() => {
    if (!dataReady || phase !== 'visible') return undefined;

    setPhase('fading');
    const timer = setTimeout(() => {
      setPhase('hidden');
      sessionStorage.setItem('vm_boot_done', '1');
      forceUnlockPageScroll();
    }, FADE_MS);
    return () => clearTimeout(timer);
  }, [dataReady, phase]);

  useEffect(() => {
    if (phase === 'hidden') {
      forceUnlockPageScroll();
    }
  }, [phase]);

  useEffect(() => () => forceUnlockPageScroll(), []);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`store-splash${phase === 'fading' ? ' store-splash--out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Cargando tienda"
      aria-hidden={phase === 'fading'}
    >
      <div className="store-splash-inner">
        <img src={BRAND.logo} alt={BRAND.name} className="store-splash-logo" />
        <p className="store-splash-label">Cargando {BRAND.name}…</p>
        <div className="store-splash-bar" aria-hidden="true">
          <div className="store-splash-bar-fill" />
        </div>
      </div>
    </div>
  );
};

export default StoreBootSplash;
