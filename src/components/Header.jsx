import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductsContext';

const Header = ({ cartCount }) => {
  const { brands } = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div style={styles.utilityBar} className="utility-bar">
        <div className="container" style={styles.utilityContainer}>
          <div style={styles.brandGroup}>
            <span className="brand-logo" style={styles.utilityBrand}>OZONO</span>
          </div>
          <div style={styles.utilityLinks}>
            <Link to="#">Buscar tienda</Link>
            <span>|</span>
            <Link to="#">Ayuda</Link>
            <span>|</span>
            <Link to="#">Únete a nosotros</Link>
            <span>|</span>
            <Link to="#">Iniciar sesión</Link>
          </div>
        </div>
      </div>

      <header style={styles.header} className="header-mobile">
        <div className="container" style={styles.container}>
          <div className="brand-logo" style={styles.logo}>
            <Link to="/">OZONO</Link>
          </div>
          <nav style={styles.nav} className="desktop-nav">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                to={`/marcas/${brand.slug}`}
                className="nav-link"
                style={styles.link}
              >
                {brand.name}
              </Link>
            ))}
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
              <span className="brand-logo" style={styles.logo}>OZONO</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={30} />
              </button>
            </div>
            <nav style={styles.mobileNav}>
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  to={`/marcas/${brand.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link"
                  style={styles.mobileLink}
                >
                  {brand.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const styles = {
  utilityBar: { backgroundColor: 'var(--color-bg-alt)', padding: '0.4rem 0', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text)' },
  utilityContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brandGroup: { display: 'flex', gap: '1rem' },
  utilityBrand: { fontSize: '0.75rem' },
  utilityLinks: { display: 'flex', gap: '0.8rem', alignItems: 'center' },
  header: { padding: '1rem 0', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 },
  container: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '1.75rem', lineHeight: 1 },
  nav: { display: 'flex', gap: '2rem' },
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
