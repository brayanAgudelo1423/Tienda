import React, { useMemo, useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { formatCOP } from '../utils/currency';
import { displayStoreText } from '../utils/displayText';
import { mediaUrl } from '../api/client';
import { motion } from 'framer-motion';
import ProductDetail from '../components/ProductDetail';
import StarRating from '../components/StarRating';
import BackNav from '../components/BackNav';

const VerTodo = ({ onAddToCart }) => {
  const { products, brands, fragranceBrands, loading } = useProducts();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const allBrandNames = useMemo(() => {
    const names = new Set([
      ...brands.map((b) => b.name),
      ...fragranceBrands.map((b) => b.name),
      ...products.map((p) => p.brand),
    ]);
    return [...names].filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [brands, fragranceBrands, products]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (brandFilter !== 'all' && p.brand !== brandFilter) return false;
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        return true;
      }),
    [products, brandFilter, categoryFilter]
  );

  const filters = (
    <div className="ver-todo-filters">
      <label>
        Marca
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="all">Todas</option>
          {allBrandNames.map((brand) => (
            <option key={brand} value={brand}>
              {displayStoreText(brand)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Categoría
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <div className="container ver-todo-page">
      <BackNav label="Volver" />
      <header className="ver-todo-head">
        <h1 className="ver-todo-title">Ver todo</h1>
        <p className="ver-todo-subtitle">
          {loading && products.length === 0
            ? 'Cargando catálogo…'
            : `${filteredProducts.length} productos disponibles`}
        </p>
      </header>

      <div className="ver-todo-layout">
        <aside className="ver-todo-sidebar">
          <p className="ver-todo-sidebar-title">Filtrar</p>
          {filters}
        </aside>

        <div className="ver-todo-main">
          {filters}

          {filteredProducts.length === 0 ? (
            <p className="ver-todo-empty">No hay productos con estos filtros.</p>
          ) : (
            <div className="product-grid ver-todo-grid">
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  className="product-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.6) }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => setSelectedProduct(product)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(product)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="product-card-image">
                    <img
                      src={mediaUrl(product.image)}
                      alt=""
                      aria-hidden="true"
                      className="product-card-bg"
                      loading="lazy"
                    />
                    <img
                      src={mediaUrl(hoveredProduct === product.id ? product.hoverImage : product.image)}
                      alt={product.name}
                      className="product-card-fg"
                    />
                  </div>
                  <div className="product-card-info">
                    <p className="product-card-brand">{displayStoreText(product.brand)}</p>
                    <h3 className="product-card-name">{displayStoreText(product.name)}</h3>
                    <p className="product-card-type">{product.productType}</p>
                    <StarRating rating={product.rating} size={14} />
                    <p className="product-card-price">{formatCOP(product.price)}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export default VerTodo;
