import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { imageUrl, hugoBossImageUrl } from '../utils/assets';
import { BRAND } from '../config/brand';

const HERO_IMAGES = [
  { src: imageUrl('Novedades', 'Polo Michael Kors Cafe Ref1.jpeg'), alt: 'Polo Michael Kors' },
  { src: imageUrl('CK', 'Polo CK Negra Ref1.jpeg'), alt: 'Polo Calvin Klein' },
  { src: imageUrl('Novedades', 'Chaqueta Jordan Ref1.jpeg'), alt: 'Chaqueta Jordan' },
  { src: imageUrl('Tomi', 'Polo Tomi Azul Ref1.jpeg'), alt: 'Polo Tommy' },
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
    <section className="hero-section">
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

      <div className="hero-overlay" />

      <div className="container hero-content-wrap">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero-cta">
            <button type="button" className="btn hero-cta-btn" onClick={() => navigate('/marcas/novedades')}>
              Comprar Ahora
            </button>
            <button
              type="button"
              className="btn btn-outline hero-cta-btn hero-cta-btn--light"
              onClick={() => {
                const el = document.getElementById('novedades-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Explorar {BRAND.short}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
