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
      <div style={styles.utilityBar} className="utility-bar">
        <div className="container" style={styles.utilityContainer}>
          <div style={styles.brandGroup}>
            <span className="brand-logo" style={styles.utilityBrand}>{BRAND.short}</span>
          </div>
          <div style={styles.utilityLinks}>
            <Link to="#">Buscar tienda</Link>
            <span>|</span>
            <Link to="/contacto">Ayuda</Link>
            <span>|</span>
            <Link to="#">Únete a nosotros</Link>
            <span>|</span>
            <Link to="/politica-de-privacidad" style={{ color: 'var(--color-text-light)' }}>Privacidad</Link>
          </div>
        </div>
      </div>

      <header style={styles.header} className="header-mobile">
        <div className="container" style={styles.container}>
          <div className="brand-logo" style={styles.logo}>
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
                className={`nav-link nav-link-lociones ${location.pathname.startsWith('/lociones') ? 'is-active' : ''}`}
                style={{ ...styles.link, fontWeight: 600 }}
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
                style={styles.link}
              >
                {brand.name}
              </Link>
            ))}
            {promoSettings.sectionEnabled && (
              <Link
                to="/promociones"
                className={`nav-link ${location.pathname === '/promociones' ? 'is-active' : ''}`}
                style={{ ...styles.link, fontWeight: 600, color: 'var(--color-secondary)' }}
              >
                {promoSettings.menuLabel}
              </Link>
            )}
            <Link
              to="/contacto"
              className="nav-link"
              style={{ ...styles.link, fontWeight: 600, color: 'var(--color-secondary)' }}
            >
              Contacto
            </Link>
          </nav>
          <div style={styles.actions}>
            <div style={styles.searchBox} className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Buscar" style={styles.searchInput} />
            </div>
            <Heart size={24} style={{ cursor: 'pointer', margin: '0 1rem' }} className="desktop-nav" />
            <Link to="/cart" style={styles.cartIcon}>
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.badge}
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} style={styles.mobileMenuBtn} className="mobile-menu">
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
            style={styles.mobileOverlay}
          >
            <div style={styles.mobileOverlayHeader}>
              <span className="brand-logo brand-logo-link" style={styles.logo}>
                <span className="brand-logo-full">{BRAND.name}</span>
                <span className="brand-logo-short">{BRAND.short}</span>
              </span>
              <button onClick={closeMobile}>
                <X size={30} />
              </button>
            </div>
            <nav style={styles.mobileNav}>
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
                  className="nav-link"
                  style={styles.mobileLink}
                >
                  {brand.name}
                </Link>
              ))}
              {promoSettings.sectionEnabled && (
                <Link
                  to="/promociones"
                  onClick={closeMobile}
                  className="nav-link"
                  style={{ ...styles.mobileLink, color: 'var(--color-secondary)', fontWeight: 700 }}
                >
                  {promoSettings.menuLabel}
                </Link>
              )}
              <Link
                to="/contacto"
                onClick={closeMobile}
                className="nav-link"
                style={{ ...styles.mobileLink, color: 'var(--color-secondary)', fontWeight: 700 }}
              >
                📞 Contacto & Ayuda
              </Link>
              <Link
                to="/politica-de-privacidad"
                onClick={closeMobile}
                className="nav-link"
                style={{ ...styles.mobileLink, fontSize: '1rem', color: 'var(--color-text-light)' }}
              >
                Política de Privacidad
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{navLocionesStyles}</style>
    </>
  );
};

const navLocionesStyles = `
  .nav-lociones-wrap {
    position: relative;
  }

  .nav-link-lociones {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-link-lociones.is-active {
    color: var(--color-secondary);
  }

  .nav-lociones-chevron {
    opacity: 0.65;
  }

  .nav-lociones-dropdown {
    position: absolute;
    top: calc(100% + 0.75rem);
    left: 50%;
    transform: translateX(-50%);
    min-width: 320px;
    max-width: 520px;
    background: #fff;
    border: 1px solid var(--color-bg-alt);
    border-radius: 14px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
    padding: 1rem;
    z-index: 120;
  }

  .nav-lociones-dropdown-all {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-secondary);
    padding: 0.35rem 0.5rem 0.85rem;
    border-bottom: 1px solid var(--color-bg-alt);
    margin-bottom: 0.85rem;
  }

  .nav-lociones-dropdown-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.15rem 1rem;
    max-height: 320px;
    overflow-y: auto;
  }

  .nav-lociones-dropdown-item {
    font-size: 0.88rem;
    color: var(--color-primary);
    padding: 0.4rem 0.5rem;
    border-radius: 8px;
    transition: background 0.15s ease;
  }

  .nav-lociones-dropdown-item:hover {
    background: var(--color-bg-alt);
  }

  .nav-lociones-mobile {
    border-bottom: 1px solid var(--color-bg-alt);
    padding-bottom: 0.5rem;
  }

  .nav-lociones-mobile-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--color-primary);
    font-family: var(--font-body);
    padding: 0 0 1rem;
    cursor: pointer;
    text-align: left;
  }

  .nav-lociones-mobile-list {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0 0 1rem 0.75rem;
  }

  .nav-lociones-mobile-all {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-secondary);
    padding: 0.35rem 0;
    margin-bottom: 0.35rem;
  }

  .nav-lociones-mobile-item {
    font-size: 1rem;
    color: var(--color-text-light);
    padding: 0.45rem 0;
  }
`;

const styles = {
  utilityBar: { backgroundColor: 'var(--color-bg-alt)', padding: '0.4rem 0', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text)' },
  utilityContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brandGroup: { display: 'flex', gap: '1rem' },
  utilityBrand: { fontSize: '0.75rem' },
  utilityLinks: { display: 'flex', gap: '0.8rem', alignItems: 'center' },
  header: { padding: '1rem 0', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 },
  container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '1.75rem', lineHeight: 1 },
  nav: { display: 'flex', gap: '2rem', alignItems: 'center' },
  link: { fontSize: '0.9rem', color: 'var(--color-primary)' },
  actions: { display: 'flex', alignItems: 'center' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-alt)', padding: '0.5rem 1rem', borderRadius: '20px', gap: '0.5rem', marginRight: '1rem' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', width: '120px' },
  cartIcon: { position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' },
  badge: { position: 'absolute', top: '-6px', right: '-8px', backgroundColor: 'var(--color-secondary)', color: '#fff', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 500 },
  mobileMenuBtn: { display: 'none', marginLeft: '1.2rem' },
  mobileOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--color-bg)', zIndex: 1000, padding: '2rem 1.2rem', overflowY: 'auto' },
  mobileOverlayHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' },
  mobileNav: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  mobileLink: { fontSize: '1.35rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-bg-alt)', paddingBottom: '1rem' },
};

export default Header;
