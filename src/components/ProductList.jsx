import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { formatCOP } from '../utils/currency';
import { displayStoreText } from '../utils/displayText';
import { mediaUrl } from '../api/client';
import ProductDetail from './ProductDetail';
import StarRating from './StarRating';

const ProductList = ({ onAddToCart }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products } = useProducts();
  const novedadesProducts = products.filter((p) => p.brand === 'Novedades').slice(0, 4);

  return (
    <>
      <section id="novedades-section" className="home-products container">
        <div className="home-products-head">
          <h2 className="home-products-title">NOVEDADES</h2>
        </div>

        <div className="product-grid home-products-grid">
          {novedadesProducts.map((product) => (
            <article
              key={product.id}
              className="product-card"
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
                  src={mediaUrl(
                    hoveredProduct === product.id ? product.hoverImage : product.image
                  )}
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
            </article>
          ))}
        </div>
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

export default ProductList;
