import React, { useState } from 'react';
import { products } from '../data';
import { motion } from 'framer-motion';
import ProductDetail from './ProductDetail';
import StarRating from './StarRating';

const ProductList = ({ onAddToCart }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <section style={styles.section} className="container">
        <div style={styles.header}>
          <h2 style={styles.title} className="mobile-title">NOVEDADES</h2>
        </div>

        <div style={styles.grid}>
          {products.slice(0, 4).map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
              style={styles.card}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => setSelectedProduct(product)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(product)}
              role="button"
              tabIndex={0}
            >
              <div style={styles.imageContainer}>
                <img
                  src={hoveredProduct === product.id ? product.hoverImage : product.image}
                  alt={product.name}
                  style={styles.image}
                />
              </div>
              <div style={styles.info}>
                <p style={styles.cardBrand}>{product.brand}</p>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.productType}>{product.productType}</p>
                <StarRating rating={product.rating} size={14} />
                <p style={styles.price}>${product.price}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <style>{`
          @media (max-width: 768px) {
            .mobile-title { font-size: 2rem !important; }
          }
        `}</style>
      </section>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};

const styles = {
  section: { padding: '2rem 0 5rem' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '0 1.2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 500,
    textTransform: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    padding: '0 1.2rem',
  },
  card: { cursor: 'pointer', display: 'flex', flexDirection: 'column' },
  imageContainer: {
    width: '100%',
    aspectRatio: '1/1',
    backgroundColor: '#f6f6f6',
    marginBottom: '1.2rem',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' },
  info: { padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  cardBrand: {
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-text-light)',
    margin: 0,
  },
  name: { fontSize: '1.1rem', fontWeight: '500', fontFamily: 'var(--font-body)', margin: 0 },
  productType: { fontSize: '0.85rem', color: 'var(--color-secondary)', margin: 0 },
  price: { fontSize: '1.1rem', fontWeight: '500', marginTop: '0.25rem' },
};

export default ProductList;
