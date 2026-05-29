import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';

const BrandMarquee = () => {
  const { brands } = useProducts();
  const brandsLoop = [...brands, ...brands];

  return (
    <section className="brand-marquee-section" style={styles.section}>
      <p style={styles.label}>Marcas 100% originales</p>
      <div className="brand-marquee">
        <div className="brand-marquee-track">
          {brandsLoop.map((brand, index) => (
            <Link
              key={`${brand.slug}-${index}`}
              to={`/marcas/${brand.slug}`}
              className="brand-marquee-item"
              style={styles.item}
            >
              <span style={styles.name}>{brand.name}</span>
              <span style={styles.dot} aria-hidden="true">◆</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '2.5rem 0',
    backgroundColor: 'var(--color-bg)',
    overflow: 'hidden',
  },
  label: {
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--color-text-light)',
    marginBottom: '1.5rem',
    padding: '0 1.2rem',
  },
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3rem',
    padding: '0 3rem',
    whiteSpace: 'nowrap',
    color: 'var(--color-primary)',
    transition: 'opacity 0.2s ease',
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
    fontWeight: 500,
    letterSpacing: '0.06em',
  },
  dot: {
    fontSize: '0.45rem',
    color: 'var(--color-text-light)',
    opacity: 0.5,
  },
};

export default BrandMarquee;
