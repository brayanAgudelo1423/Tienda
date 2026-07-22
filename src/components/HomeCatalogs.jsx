import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { usePromotions } from '../context/PromotionsContext';
import { BRAND } from '../config/brand';
import { displayStoreText } from '../utils/displayText';

const HomeCatalogs = () => {
  const { fashionBrands } = useProducts();
  const { settings: promoSettings } = usePromotions();
  const scrollerRef = useRef(null);

  const cards = useMemo(() => {
    const list = [
      {
        id: 'lociones',
        title: 'Lociones originales',
        to: '/lociones',
      },
      ...fashionBrands.map((brand) => ({
        id: brand.slug,
        title: displayStoreText(brand.name),
        to: `/marcas/${brand.slug}`,
      })),
    ];

    if (promoSettings.sectionEnabled) {
      list.push({
        id: 'promociones',
        title: promoSettings.menuLabel || 'Promociones',
        to: '/promociones',
      });
    }

    return list;
  }, [fashionBrands, promoSettings.menuLabel, promoSettings.sectionEnabled]);

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.75) * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="home-catalogs" aria-labelledby="home-catalogs-title">
      <div className="container home-catalogs-head-row">
        <div className="home-catalogs-head">
          <h2 id="home-catalogs-title" className="home-catalogs-title">
            {BRAND.name}
          </h2>
          <p className="home-catalogs-lead">Elige tu elegancia</p>
        </div>
        <div className="home-catalogs-controls" aria-hidden="true">
          <button type="button" className="home-catalogs-nav-btn" onClick={() => scrollByCard(-1)}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="home-catalogs-nav-btn" onClick={() => scrollByCard(1)}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="home-catalogs-rail">
        <div
          ref={scrollerRef}
          className="home-catalogs-track"
          tabIndex={0}
          role="list"
          aria-label="Colecciones"
        >
          {cards.map((cat, index) => (
            <motion.div
              key={cat.id}
              role="listitem"
              className="home-catalog-slide"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.28) }}
            >
              <Link to={cat.to} className="home-catalog-card" state={{ fromHomeCatalog: true }}>
                <div className="home-catalog-card-media" aria-hidden="true">
                  <span className="home-catalog-logo-spin brand-logo-visual--spin">
                    <img src={BRAND.logo} alt="" className="home-catalog-logo-img" />
                  </span>
                  <div className="home-catalog-card-shade" />
                </div>
                <div className="home-catalog-card-body">
                  <h3>{cat.title}</h3>
                  <span className="home-catalog-card-arrow">
                    <ArrowUpRight size={18} strokeWidth={1.75} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCatalogs;
