import React from 'react';
import { motion } from 'framer-motion';

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=90&auto=format&fit=crop',
    alt: 'Zapatillas Nike',
  },
  {
    src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1920&q=90&auto=format&fit=crop',
    alt: 'Sneakers premium',
  },
  {
    src: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&q=90&auto=format&fit=crop',
    alt: 'Chamarra de cuero',
  },
  {
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=90&auto=format&fit=crop',
    alt: 'Colección de moda',
  },
  {
    src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=90&auto=format&fit=crop',
    alt: 'Estilo urbano',
  },
  {
    src: 'https://images.unsplash.com/photo-1483985988354-763728e3685b?w=1920&q=90&auto=format&fit=crop',
    alt: 'Shopping premium',
  },
];

const Hero = () => {
  const slides = [...HERO_IMAGES, ...HERO_IMAGES];

  return (
    <section style={styles.hero}>
      <div className="hero-filmstrip">
        <div className="hero-filmstrip-track">
          {slides.map((image, index) => (
            <div key={`${image.src}-${index}`} className="hero-slide">
              <img
                src={image.src}
                alt={image.alt}
                className={`hero-living hero-living-${index % HERO_IMAGES.length}`}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={styles.overlay} />

      <div className="container" style={styles.contentContainer}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={styles.content}
        >
          <div style={styles.btnGroup}>
            <button type="button" className="btn">
              Comprar Ahora
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ backgroundColor: '#fff', border: 'none' }}
            >
              Explorar OZONO
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const styles = {
  hero: { width: '100%', marginBottom: '4rem', position: 'relative' },
  overlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.35) 100%)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  contentContainer: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 2,
    pointerEvents: 'none',
  },
  content: { maxWidth: '800px', padding: '0 1rem', width: '100%', pointerEvents: 'auto' },
  btnGroup: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
};

export default Hero;
