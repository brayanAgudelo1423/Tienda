import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductsContext';
import { formatCOP } from '../utils/currency';
import { displayStoreText } from '../utils/displayText';
import { mediaUrl } from '../api/client';
import { LOCIONES_CATEGORY, GENDERS } from '../constants/catalog';
import { getBrandNameBySlug } from '../utils/brands';
import ProductDetail from '../components/ProductDetail';
import StarRating from '../components/StarRating';
import BackNav from '../components/BackNav';

const Lociones = ({ onAddToCart }) => {
  const { brandSlug } = useParams();
  const { products, fragranceBrands } = useProducts();
  const activeBrand = brandSlug ? getBrandNameBySlug(fragranceBrands, brandSlug) : null;

  const [gender, setGender] = useState('all');
  const [brand, setBrand] = useState(activeBrand || 'all');
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(800000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const lociones = useMemo(
    () => products.filter((p) => p.category === LOCIONES_CATEGORY),
    [products]
  );

  const brandOptions = useMemo(() => {
    const names = [...new Set(lociones.map((p) => p.brand))].sort((a, b) => a.localeCompare(b));
    return names;
  }, [lociones]);

  const priceBounds = useMemo(() => {
    const prices = lociones.map((p) => p.price);
    if (!prices.length) return { min: 50000, max: 800000 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices, 800000),
    };
  }, [lociones]);

  useEffect(() => {
    setBrand(activeBrand || 'all');
    setGender('all');
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
  }, [activeBrand, brandSlug, priceBounds.min, priceBounds.max]);

  const filteredProducts = useMemo(() => {
    return lociones.filter((product) => {
      if (gender !== 'all' && product.gender !== gender) return false;
      if (brand !== 'all' && product.brand !== brand) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      return true;
    });
  }, [lociones, gender, brand, minPrice, maxPrice]);

  const resetFilters = () => {
    setGender('all');
    setBrand(activeBrand || 'all');
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
  };

  if (brandSlug && !activeBrand) {
    return <Navigate to="/lociones" replace />;
  }

  const FiltersPanel = ({ compact = false }) => (
    <div className={`lociones-filters ${compact ? 'lociones-filters-compact' : ''}`}>
      <div className="lociones-filter-block">
        <h3>Género</h3>
        <div className="lociones-chip-row">
          <button
            type="button"
            className={`lociones-chip ${gender === 'all' ? 'is-active' : ''}`}
            onClick={() => setGender('all')}
          >
            Todos
          </button>
          {GENDERS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`lociones-chip ${gender === g.id ? 'is-active' : ''}`}
              onClick={() => setGender(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lociones-filter-block">
        <h3>Marca</h3>
        <select
          className="lociones-select"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="all">Todas las marcas</option>
          {brandOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="lociones-filter-block">
        <h3>
          Precio: {formatCOP(minPrice)} – {formatCOP(maxPrice)}
        </h3>
        <label className="lociones-range-label">
          Mínimo
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={Math.min(minPrice, maxPrice)}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
          />
        </label>
        <label className="lociones-range-label">
          Máximo
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={Math.max(maxPrice, minPrice)}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
          />
        </label>
        <div className="lociones-range-bounds">
          <span>{formatCOP(priceBounds.min)}</span>
          <span>{formatCOP(priceBounds.max)}</span>
        </div>
      </div>

      <button type="button" className="lociones-reset" onClick={resetFilters}>
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <>
      <div className="lociones-page container">
        <BackNav label="Volver" />
        <header className="lociones-header">
          <div>
            <p className="lociones-eyebrow">Perfumería de lujo</p>
            <h1>{activeBrand ? activeBrand : 'Lociones originales'}</h1>
            <p className="lociones-subtitle">
              {activeBrand
                ? `Fragancias originales ${activeBrand} · Mujer y hombre`
                : 'Fragancias auténticas de las mejores marcas · Mujer y hombre'}
            </p>
          </div>
          <p className="lociones-count">{filteredProducts.length} productos</p>
        </header>

        <button
          type="button"
          className="lociones-mobile-filters-btn"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal size={18} />
          Filtros
        </button>

        <div className="lociones-layout">
          <aside className="lociones-sidebar">
            <FiltersPanel />
          </aside>

          <main className="lociones-grid product-grid">
            {filteredProducts.length === 0 ? (
              <p className="lociones-empty">
                No hay lociones con estos filtros. Prueba ampliar el rango de precio o cambiar
                marca.
              </p>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  className="lociones-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => setSelectedProduct(product)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(product)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="lociones-card-image product-card-image">
                    <img
                      src={mediaUrl(product.image)}
                      alt=""
                      aria-hidden="true"
                      className="product-card-bg"
                      loading="lazy"
                    />
                    <img
                      src={mediaUrl(
                        hoveredProduct === product.id ? product.hoverImage : product.image
                      )}
                      alt={product.name}
                      className="product-card-fg"
                    />
                  </div>
                  <div className="lociones-card-info">
                    <p className="lociones-card-brand">{displayStoreText(product.brand)}</p>
                    <h3>{displayStoreText(product.name)}</h3>
                    <p className="lociones-card-type">{product.productType}</p>
                    <StarRating rating={product.rating} size={14} />
                    <p className="lociones-card-price">{formatCOP(product.price)}</p>
                  </div>
                </motion.article>
              ))
            )}
          </main>
        </div>
      </div>

      {filtersOpen && (
        <div className="lociones-drawer-overlay" onClick={() => setFiltersOpen(false)}>
          <div className="lociones-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="lociones-drawer-head">
              <h2>Filtros</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Cerrar">
                <X size={22} />
              </button>
            </div>
            <FiltersPanel compact />
            <button type="button" className="btn lociones-apply-btn" onClick={() => setFiltersOpen(false)}>
              Ver {filteredProducts.length} productos
            </button>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}

      <style>{locionesStyles}</style>
    </>
  );
};

const locionesStyles = `
  .lociones-page {
    padding: 2.5rem 1.2rem 4rem;
    min-height: 70vh;
  }

  .lociones-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    border-bottom: 1px solid var(--color-bg-alt);
    padding-bottom: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .lociones-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-secondary);
    margin: 0 0 0.4rem;
    font-weight: 600;
  }

  .lociones-header h1 {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 500;
    margin: 0 0 0.35rem;
    text-transform: none;
  }

  .lociones-subtitle {
    margin: 0;
    color: var(--color-text-light);
    font-size: 0.95rem;
    max-width: 520px;
  }

  .lociones-count {
    margin: 0;
    color: var(--color-text-light);
    font-size: 0.95rem;
    white-space: nowrap;
  }

  .lociones-mobile-filters-btn {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-bottom: 1.25rem;
    padding: 0.85rem 1rem;
    border: 1px solid var(--color-bg-alt);
    border-radius: 12px;
    background: #fff;
    font-family: var(--font-body);
    font-size: 0.95rem;
    cursor: pointer;
  }

  .lociones-layout {
    display: flex;
    gap: 2.5rem;
    align-items: flex-start;
  }

  .lociones-sidebar {
    width: 260px;
    flex-shrink: 0;
    position: sticky;
    top: 100px;
  }

  .lociones-filters {
    background: var(--color-bg-alt);
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .lociones-filter-block h3 {
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
    text-transform: none;
    letter-spacing: 0;
  }

  .lociones-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .lociones-chip {
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    font-size: 0.82rem;
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s ease;
  }

  .lociones-chip.is-active {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
  }

  .lociones-select {
    width: 100%;
    padding: 0.75rem 0.85rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    background: #fff;
  }

  .lociones-range-label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.78rem;
    color: var(--color-text-light);
    margin-bottom: 0.65rem;
  }

  .lociones-range-label input {
    width: 100%;
    accent-color: var(--color-primary);
  }

  .lociones-range-bounds {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: var(--color-text-light);
  }

  .lociones-reset {
    border: none;
    background: none;
    color: var(--color-secondary);
    font-size: 0.85rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font-family: var(--font-body);
  }

  .lociones-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 1.75rem;
  }

  .lociones-card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }

  .lociones-card-image {
    position: relative;
    aspect-ratio: 4/5;
    background: #f6f6f6;
    margin-bottom: 0.85rem;
    overflow: hidden;
    border-radius: 10px;
  }

  .lociones-card-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .lociones-card-brand {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-light);
    margin: 0;
  }

  .lociones-card-info h3 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    font-family: var(--font-body);
  }

  .lociones-card-type {
    font-size: 0.78rem;
    color: var(--color-secondary);
    margin: 0;
  }

  .lociones-card-price {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.25rem 0 0;
  }

  .lociones-empty {
    grid-column: 1 / -1;
    color: var(--color-text-light);
    font-size: 1rem;
    padding: 2rem 0;
  }

  .lociones-drawer-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 200;
    align-items: flex-end;
  }

  .lociones-drawer {
    width: 100%;
    max-height: 88vh;
    overflow-y: auto;
    background: #fff;
    border-radius: 18px 18px 0 0;
    padding: 1.25rem 1.2rem calc(1.25rem + env(safe-area-inset-bottom));
  }

  .lociones-drawer-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .lociones-drawer-head h2 {
    margin: 0;
    font-size: 1.15rem;
    text-transform: none;
    font-family: var(--font-body);
  }

  .lociones-drawer-head button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0.25rem;
  }

  .lociones-apply-btn {
    width: 100%;
    margin-top: 1rem;
  }

  @media (max-width: 900px) {
    .lociones-sidebar { display: none; }
    .lociones-mobile-filters-btn { display: flex; }
    .lociones-drawer-overlay { display: flex; }
    .lociones-header { flex-direction: column; align-items: flex-start; }
    .lociones-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
  }
`;

export default Lociones;
