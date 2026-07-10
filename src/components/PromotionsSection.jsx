import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, mediaUrl } from '../api/client';

const FALLBACK_PROMOTIONS = [
  {
    id: 'fallback-1',
    title: 'Lociones originales',
    subtitle: 'Selección premium con descuento especial esta semana',
    badge: '-20%',
    image: '',
  },
  {
    id: 'fallback-2',
    title: 'Envío gratis',
    subtitle: 'En compras superiores a $200.000 COP',
    badge: 'ENVÍO',
    image: '',
  },
  {
    id: 'fallback-3',
    title: 'Novedades de temporada',
    subtitle: 'Piezas limitadas en moda y accesorios',
    badge: 'NUEVO',
    image: '',
  },
];

const PromotionsSection = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPromotions()
      .then((data) => {
        setPromotions(Array.isArray(data) && data.length > 0 ? data : FALLBACK_PROMOTIONS);
      })
      .catch(() => setPromotions(FALLBACK_PROMOTIONS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="promotions-section container" aria-hidden="true">
        <div className="promotions-head">
          <h2 className="promotions-title">Promociones</h2>
        </div>
        <div className="promotions-track promotions-track--loading">
          {[1, 2, 3].map((n) => (
            <div key={n} className="promo-card promo-card--skeleton" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="promociones"
      className="promotions-section container"
      aria-labelledby="promotions-title"
    >
      <div className="promotions-head">
        <h2 id="promotions-title" className="promotions-title">
          Promociones
        </h2>
        <p className="promotions-subtitle">Ofertas activas en OZONO</p>
      </div>

      <div className="promotions-track">
        {promotions.map((promo, index) => (
          <motion.article
            key={promo.id}
            className="promo-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
          >
            <div className="promo-card-inner">
              {promo.image ? (
                <div className="promo-card-media">
                  <img src={mediaUrl(promo.image)} alt="" loading="lazy" />
                  {promo.badge && (
                    <span className="promo-badge promo-badge--overlay">{promo.badge}</span>
                  )}
                </div>
              ) : (
                <div className={`promo-card-banner promo-card-banner--${index % 3}`}>
                  {promo.badge ? (
                    <span className="promo-badge promo-badge--large">{promo.badge}</span>
                  ) : (
                    <span className="promo-badge promo-badge--large promo-badge--ghost">OFERTA</span>
                  )}
                </div>
              )}

              <div className="promo-card-body">
                <h3>{promo.title}</h3>
                {promo.subtitle && <p>{promo.subtitle}</p>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default PromotionsSection;
