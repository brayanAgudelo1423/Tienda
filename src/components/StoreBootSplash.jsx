import React, { useEffect, useState } from 'react';
import { BRAND } from '../config/brand';
import { useProducts } from '../context/ProductsContext';
import { usePromotions } from '../context/PromotionsContext';

const MIN_VISIBLE_MS = 800;
const FADE_MS = 450;

const StoreBootSplash = () => {
  const { loading: productsLoading } = useProducts();
  const { loading: promosLoading } = usePromotions();
  const [logoReady, setLogoReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [phase, setPhase] = useState('visible');

  useEffect(() => {
    const img = new Image();
    const done = () => setLogoReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = BRAND.logo;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  const dataReady = !productsLoading && !promosLoading && logoReady && minElapsed;

  useEffect(() => {
    if (!dataReady || phase !== 'visible') return undefined;

    setPhase('fading');
    const timer = setTimeout(() => setPhase('hidden'), FADE_MS);
    return () => clearTimeout(timer);
  }, [dataReady, phase]);

  useEffect(() => {
    if (phase === 'hidden') return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`store-splash${phase === 'fading' ? ' store-splash--out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Cargando tienda"
    >
      <img src={BRAND.logo} alt={BRAND.name} className="store-splash-logo" />
    </div>
  );
};

export default StoreBootSplash;
