import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { getBrandBySlug } from '../utils/product';
import { formatCOP } from '../utils/currency';
import { displayStoreText } from '../utils/displayText';
import { mediaUrl } from '../api/client';
import { motion } from 'framer-motion';
import ProductDetail from '../components/ProductDetail';
import StarRating from '../components/StarRating';
import BackNav from '../components/BackNav';

const Brands = ({ onAddToCart }) => {
  const { brandSlug } = useParams();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products, brands } = useProducts();
  const activeBrand = getBrandBySlug(brands, brandSlug);

  const brandProducts = useMemo(
    () => (activeBrand ? products.filter((p) => p.brand === activeBrand) : []),
    [products, activeBrand]
  );

  const maxProductPrice = useMemo(
    () => Math.max(...brandProducts.map((p) => p.price), 50000),
    [brandProducts]
  );

  // Al entrar / cambiar de marca: filtro en el precio máximo
  useEffect(() => {
    setMaxPrice(maxProductPrice);
  }, [brandSlug, maxProductPrice]);

  if (!activeBrand) {
    return <Navigate to="/marcas/lacoste" replace />;
  }

  const effectiveMax = maxPrice ?? maxProductPrice;
  const filteredProducts = brandProducts.filter((product) => product.price <= effectiveMax);

  return (
    <>
      <div className="container" style={styles.container}>
        <BackNav label="Volver" />
        <div style={styles.header}>
          <h1 style={styles.pageTitle} className="brands-page-title">
            {activeBrand}
          </h1>
          <p style={styles.resultCount}>{filteredProducts.length} productos</p>
        </div>

        <div className="brands-layout" style={styles.layout}>
          <aside className="brands-sidebar" style={styles.sidebar}>
            <div style={styles.filterGroup}>
              <h3 style={styles.filterTitle}>Precio máximo: {formatCOP(effectiveMax)}</h3>
              <input
                type="range"
                min="50000"
                max={maxProductPrice}
                value={Math.min(effectiveMax, maxProductPrice)}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                style={styles.rangeInput}
              />
              <div style={styles.rangeLabels}>
                <span>{formatCOP(50000)}</span>
                <span>{formatCOP(maxProductPrice)}</span>
              </div>
            </div>
          </aside>

          <main style={styles.grid} className="product-grid">
            {filteredProducts.length === 0 ? (
              <p style={styles.emptyMessage}>
                No hay productos de {activeBrand} en este rango de precio.
              </p>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={styles.card}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => setSelectedProduct(product)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(product)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={styles.imageContainer} className="product-card-image">
                    <img
                      src={mediaUrl(product.image)}
                      alt=""
                      aria-hidden="true"
                      style={styles.bgImage}
                      className="product-card-bg"
                      loading="lazy"
                    />
                    <img
                      src={mediaUrl(
                        hoveredProduct === product.id ? product.hoverImage : product.image
                      )}
                      alt={product.name}
                      style={styles.image}
                      className="product-card-fg"
                    />
                  </div>
                  <div style={styles.info}>
                    <p style={styles.cardBrand}>{displayStoreText(product.brand)}</p>
                    <h3 style={styles.name}>{displayStoreText(product.name)}</h3>
                    <p style={styles.productType}>{product.productType}</p>
                    <StarRating rating={product.rating} size={14} />
                    <p style={styles.price}>{formatCOP(product.price)}</p>
                  </div>
                </motion.article>
              ))
            )}
          </main>
        </div>
      </div>

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
  container: { padding: '3rem 1.2rem', minHeight: '70vh' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: '1px solid var(--color-bg-alt)',
    paddingBottom: '1rem',
    marginBottom: '2rem',
  },
  pageTitle: {
    fontSize: '2.75rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 500,
    margin: 0,
    lineHeight: 1,
    textTransform: 'none',
  },
  resultCount: { fontSize: '1rem', color: 'var(--color-text-light)', margin: 0 },
  layout: { display: 'flex', gap: '3rem', alignItems: 'flex-start' },
  sidebar: {
    width: '220px',
    flexShrink: 0,
    paddingRight: '2rem',
    borderRight: '1px solid var(--color-bg-alt)',
  },
  filterGroup: { marginBottom: 0 },
  filterTitle: {
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '1.2rem',
    fontFamily: 'var(--font-body)',
    textTransform: 'none',
  },
  rangeInput: {
    width: '100%',
    cursor: 'pointer',
    height: '4px',
    backgroundColor: 'var(--color-bg-alt)',
    accentColor: 'var(--color-primary)',
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--color-text-light)',
    marginTop: '0.8rem',
    fontWeight: 400,
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '2rem',
  },
  emptyMessage: { fontSize: '1.1rem', marginTop: '2rem', color: 'var(--color-text-light)' },
  card: { cursor: 'pointer', display: 'flex', flexDirection: 'column' },
  imageContainer: {
    width: '100%',
    aspectRatio: '4/5',
    backgroundColor: '#f6f6f6',
    marginBottom: '1rem',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bgImage: {
    position: 'absolute',
    inset: 0,
  },
  image: { width: '100%', height: '100%', objectFit: 'contain', transition: 'all 0.5s ease' },
  info: { padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  cardBrand: {
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-text-light)',
    margin: 0,
  },
  name: { fontSize: '1.05rem', fontWeight: '500', fontFamily: 'var(--font-body)', margin: 0 },
  productType: { fontSize: '0.8rem', color: 'var(--color-secondary)', margin: 0 },
  price: { fontSize: '1.05rem', fontWeight: '500', marginTop: '0.25rem' },
};

export default Brands;
