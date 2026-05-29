import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { imageUrl, hugoBossImageUrl } from '../utils/assets';

const HERO_IMAGES = [
  { src: imageUrl('Novedades', 'Polo Michael Kors Cafe Ref1.jpeg'), alt: 'Polo Michael Kors' },
  { src: imageUrl('CK', 'Polo CK Negra Ref1.jpeg'), alt: 'Polo Calvin Klein' },
  { src: imageUrl('Novedades', 'Chaqueta Jordan Ref1.jpeg'), alt: 'Chaqueta Jordan' },
  { src: imageUrl('Tomi', 'Polo Tomi Azul Ref1.jpeg'), alt: 'Polo Tomi' },
  {
    src: imageUrl('Lacoste', 'Conjunto o separado Lacoste Azul.jpeg'),
    alt: 'Conjunto Lacoste Azul',
  },
  { src: hugoBossImageUrl('Conjunto Boss.jpeg'), alt: 'Conjunto Boss' },
];

const Hero = () => {
  const navigate = useNavigate();
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
                className="hero-slide-fg"
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
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/marcas/novedades')}
            >
              Comprar Ahora
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ backgroundColor: '#fff', border: 'none' }}
              onClick={() => {
                const el = document.getElementById('novedades-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
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
