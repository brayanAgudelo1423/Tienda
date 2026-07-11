import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductsContext';
import { usePromotions } from '../context/PromotionsContext';
import { BRAND } from '../config/brand';

const Header = ({ cartCount }) => {
  const { fashionBrands, fragranceBrands } = useProducts();
  const { settings: promoSettings } = usePromotions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locionesOpen, setLocionesOpen] = useState(false);
  const [locionesMobileOpen, setLocionesMobileOpen] = useState(false);
  const location = useLocation();

  const closeMobile = () => {
    setIsMenuOpen(false);
    setLocionesMobileOpen(false);
  };

  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar-inner">
          <div className="utility-bar-brand">
            <span className="brand-logo utility-brand">{BRAND.short}</span>
          </div>
          <div className="utility-bar-links">
            <Link to="#">Buscar tienda</Link>
            <span>|</span>
            <Link to="/contacto">Ayuda</Link>
            <span>|</span>
            <Link to="#">Únete a nosotros</Link>
            <span>|</span>
            <Link to="/politica-de-privacidad" className="utility-bar-link utility-bar-link--muted">Privacidad</Link>
          </div>
        </div>
      </div>

      <header className="site-header header-mobile">
        <div className="container site-header-inner">
          <div className="site-header-logo brand-logo">
            <Link to="/" className="brand-logo-link">
              <span className="brand-logo-full">{BRAND.name}</span>
              <span className="brand-logo-short">{BRAND.short}</span>
            </Link>
          </div>
          <nav className="nav-main desktop-nav">
            <div
              className="nav-lociones-wrap"
              onMouseEnter={() => setLocionesOpen(true)}
              onMouseLeave={() => setLocionesOpen(false)}
            >
              <Link
                to="/lociones"
                className={`nav-link nav-link-lociones nav-link--strong ${location.pathname.startsWith('/lociones') ? 'is-active' : ''}`}
              >
                Lociones originales
                <ChevronDown size={14} className="nav-lociones-chevron" />
              </Link>

              <AnimatePresence>
                {locionesOpen && (
                  <motion.div
                    className="nav-lociones-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Link to="/lociones" className="nav-lociones-dropdown-all">
                      Ver todas las lociones
                    </Link>
                    <div className="nav-lociones-dropdown-grid">
                      {fragranceBrands.map((brand) => (
                        <Link
                          key={brand.slug}
                          to={`/lociones/marca/${brand.slug}`}
                          className="nav-lociones-dropdown-item"
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {fashionBrands.map((brand) => (
              <Link
                key={brand.slug}
                to={`/marcas/${brand.slug}`}
                className="nav-link"
              >
                {brand.name}
              </Link>
            ))}
            {promoSettings.sectionEnabled && (
              <Link
                to="/promociones"
                className={`nav-link nav-link--accent ${location.pathname === '/promociones' ? 'is-active' : ''}`}
              >
                {promoSettings.menuLabel}
              </Link>
            )}
            <Link
              to="/contacto"
              className="nav-link nav-link--accent"
            >
              Contacto
            </Link>
          </nav>
          <div className="site-header-actions">
            <div className="search-box site-search">
              <Search size={18} />
              <input type="text" placeholder="Buscar" className="site-search-input" />
            </div>
            <Heart size={22} className="desktop-nav site-header-icon" />
            <Link to="/cart" className="site-cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="site-cart-badge"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="mobile-menu site-menu-btn"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="mobile-drawer"
          >
            <div className="mobile-drawer-head">
              <span className="brand-logo brand-logo-link mobile-drawer-logo">
                <span className="brand-logo-full">{BRAND.name}</span>
                <span className="brand-logo-short">{BRAND.short}</span>
              </span>
              <button type="button" onClick={closeMobile} aria-label="Cerrar menú">
                <X size={28} />
              </button>
            </div>
            <nav className="mobile-drawer-nav">
              <div className="nav-lociones-mobile">
                <button
                  type="button"
                  className="nav-lociones-mobile-toggle"
                  onClick={() => setLocionesMobileOpen((v) => !v)}
                  aria-expanded={locionesMobileOpen}
                >
                  <span>Lociones originales</span>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: locionesMobileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                {locionesMobileOpen && (
                  <div className="nav-lociones-mobile-list">
                    <Link
                      to="/lociones"
                      onClick={closeMobile}
                      className="nav-lociones-mobile-all"
                    >
                      Ver todas
                    </Link>
                    {fragranceBrands.map((brand) => (
                      <Link
                        key={brand.slug}
                        to={`/lociones/marca/${brand.slug}`}
                        onClick={closeMobile}
                        className="nav-lociones-mobile-item"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {fashionBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/marcas/${brand.slug}`}
                  onClick={closeMobile}
                  className="nav-link mobile-drawer-link"
                >
                  {brand.name}
                </Link>
              ))}
              {promoSettings.sectionEnabled && (
                <Link
                  to="/promociones"
                  onClick={closeMobile}
                  className="nav-link mobile-drawer-link mobile-drawer-link--accent"
                >
                  {promoSettings.menuLabel}
                </Link>
              )}
              <Link
                to="/contacto"
                onClick={closeMobile}
                className="nav-link mobile-drawer-link mobile-drawer-link--accent"
              >
                Contacto & Ayuda
              </Link>
              <Link
                to="/politica-de-privacidad"
                onClick={closeMobile}
                className="nav-link mobile-drawer-link mobile-drawer-link--muted"
              >
                Política de Privacidad
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
