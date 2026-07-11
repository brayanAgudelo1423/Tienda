import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PromoCardsGrid from '../components/PromoCardsGrid';
import { usePromotions } from '../context/PromotionsContext';
import { BRAND } from '../config/brand';

const Promociones = ({ onAddToCart }) => {
  const { settings, items, loading } = usePromotions();

  if (!loading && !settings.sectionEnabled) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="promociones-page">
      <section className="promociones-hero">
        <motion.div
          className="promociones-hero-inner container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="promociones-hero-tag">Ofertas {BRAND.short}</p>
          <h1>{settings.pageTitle}</h1>
          {settings.pageSubtitle && <p className="promociones-hero-sub">{settings.pageSubtitle}</p>}
        </motion.div>
      </section>

      <section className="promociones-content container" aria-labelledby="promociones-grid-title">
        <h2 id="promociones-grid-title" className="visually-hidden">
          Listado de promociones
        </h2>
        <PromoCardsGrid
          promotions={items}
          loading={loading}
          variant="page"
          onAddToCart={onAddToCart}
        />
      </section>
    </main>
  );
};

export default Promociones;
