import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from './StarRating';

const ProductDetail = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize('');
      setSelectedColor('');
      setError('');
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    if (!selectedSize) {
      setError('Selecciona una talla');
      return;
    }
    if (!selectedColor) {
      setError('Selecciona un color');
      return;
    }
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      colorName: product.colors.find((c) => c.hex === selectedColor)?.name ?? selectedColor,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        style={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={styles.modal}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
        >
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Cerrar">
            <X size={24} />
          </button>

          <div className="product-detail-layout" style={styles.layout}>
            <div className="product-detail-image" style={styles.imageWrap}>
              <img src={product.image} alt={product.name} style={styles.image} />
            </div>

            <div style={styles.content}>
              <p style={styles.brand}>{product.brand}</p>
              <p style={styles.productType}>{product.productType}</p>

              <h2 id="product-detail-title" style={styles.name}>
                {product.name}
              </h2>

              <StarRating rating={product.rating} reviewCount={product.reviewCount} />

              <p style={styles.price}>${product.price}</p>
              <p style={styles.description}>{product.description}</p>

              <div style={styles.optionGroup}>
                <h4 style={styles.optionLabel}>Talla</h4>
                <div style={styles.sizeGrid}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      style={{
                        ...styles.sizeBtn,
                        ...(selectedSize === size ? styles.sizeBtnActive : {}),
                      }}
                      onClick={() => {
                        setSelectedSize(size);
                        setError('');
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.optionGroup}>
                <h4 style={styles.optionLabel}>Color</h4>
                <div style={styles.colorGrid}>
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      title={color.name}
                      style={{
                        ...styles.colorBtn,
                        backgroundColor: color.hex,
                        border:
                          selectedColor === color.hex
                            ? '2px solid var(--color-primary)'
                            : color.hex === '#ffffff' || color.hex === '#fff'
                              ? '1px solid #ccc'
                              : '2px solid transparent',
                        boxShadow: selectedColor === color.hex ? '0 0 0 2px #fff, 0 0 0 4px var(--color-primary)' : 'none',
                      }}
                      onClick={() => {
                        setSelectedColor(color.hex);
                        setError('');
                      }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p style={styles.colorName}>
                    {product.colors.find((c) => c.hex === selectedColor)?.name}
                  </p>
                )}
              </div>

              {error && <p style={styles.error}>{error}</p>}

              <button type="button" className="btn" style={styles.addBtn} onClick={handleAdd}>
                Añadir a la bolsa
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .product-detail-layout { display: flex; gap: 2.5rem; align-items: flex-start; }
        .product-detail-image { flex: 0 0 42%; aspect-ratio: 1/1; }
        @media (max-width: 768px) {
          .product-detail-layout { flex-direction: column !important; }
          .product-detail-image { flex: none !important; width: 100% !important; max-height: 300px !important; aspect-ratio: 4/3 !important; }
        }
      `}</style>
    </AnimatePresence>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  modal: {
    position: 'relative',
    backgroundColor: 'var(--color-bg)',
    borderRadius: '8px',
    maxWidth: '960px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '2rem',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    zIndex: 10,
    padding: '0.25rem',
    color: 'var(--color-primary)',
  },
  layout: {},
  imageWrap: {
    backgroundColor: 'var(--color-bg-alt)',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  content: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' },
  brand: {
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--color-text-light)',
    margin: 0,
  },
  productType: {
    fontSize: '0.95rem',
    color: 'var(--color-secondary)',
    fontWeight: 500,
    margin: 0,
  },
  name: {
    fontSize: '1.75rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 500,
    margin: '0.25rem 0 0',
    lineHeight: 1.2,
    textTransform: 'none',
  },
  price: { fontSize: '1.35rem', fontWeight: 500, margin: '0.25rem 0' },
  description: { fontSize: '0.95rem', color: 'var(--color-text-light)', lineHeight: 1.6, margin: '0.5rem 0 1rem' },
  optionGroup: { marginTop: '0.5rem' },
  optionLabel: {
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '0.75rem',
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-text-light)',
  },
  sizeGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  sizeBtn: {
    minWidth: '48px',
    padding: '0.65rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: 500,
    backgroundColor: '#fff',
    color: 'var(--color-primary)',
    transition: 'var(--transition)',
  },
  sizeBtnActive: {
    borderColor: 'var(--color-primary)',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
  },
  colorGrid: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  colorBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  colorName: { fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.5rem' },
  error: { color: '#c00', fontSize: '0.9rem', margin: '0.25rem 0' },
  addBtn: { marginTop: '1rem', width: '100%', maxWidth: '280px' },
};

export default ProductDetail;
