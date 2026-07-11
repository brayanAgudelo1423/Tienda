import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { mediaUrl } from '../api/client';
import { formatCOP } from '../utils/currency';
import {
  canBuyPromotion,
  promoSavings,
  promotionToCartItem,
  resolvePromoBadge,
} from '../utils/promo';
import { getCartItemId } from '../utils/product';

const PromoCardsGrid = ({ promotions, loading = false, variant = 'page', onAddToCart }) => {
  const navigate = useNavigate();
  const [addedId, setAddedId] = useState(null);

  const handleBuy = (promo) => {
    if (!canBuyPromotion(promo) || !onAddToCart) return;
    const cartItem = promotionToCartItem(promo);
    onAddToCart(cartItem);
    setAddedId(getCartItemId(cartItem));
    window.setTimeout(() => setAddedId(null), 2200);
  };

  const handleBuyNow = (promo) => {
    handleBuy(promo);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className={`promotions-track promotions-track--${variant} promotions-track--loading`}>
        {[1, 2, 3].map((n) => (
          <div key={n} className="promo-card promo-card--skeleton" />
        ))}
      </div>
    );
  }

  if (!promotions.length) {
    return (
      <div className="promotions-empty">
        <p>No hay promociones publicadas en este momento.</p>
        <span>Vuelve pronto para descubrir nuevas ofertas.</span>
      </div>
    );
  }

  return (
    <div className={`promotions-track promotions-track--${variant}`}>
      {promotions.map((promo, index) => {
        const badge = resolvePromoBadge(promo);
        const showPrices = Number(promo.priceNow) > 0;
        const showBefore = Number(promo.priceBefore) > 0;
        const buyable = canBuyPromotion(promo);
        const savings =
          showBefore && showPrices ? promoSavings(promo.priceBefore, promo.priceNow) : 0;
        const cartId = `promo-${promo.id}`;
        const justAdded = addedId === cartId;

        return (
          <motion.article
            key={promo.id}
            className="promo-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
          >
            <div className="promo-card-inner">
              <div className="promo-card-visual">
                {promo.image ? (
                  <div className="promo-card-media">
                    <img src={mediaUrl(promo.image)} alt="" loading="lazy" />
                  </div>
                ) : (
                  <div className={`promo-card-banner promo-card-banner--${index % 3}`}>
                    <span className="promo-card-banner-mark">{index + 1}</span>
                  </div>
                )}
                {badge && <span className="promo-badge promo-badge--overlay">{badge}</span>}
              </div>

              <div className="promo-card-body">
                <h3>{promo.title}</h3>
                {promo.subtitle && <p className="promo-card-desc">{promo.subtitle}</p>}

                {showPrices && (
                  <div className="promo-price-block">
                    <div className="promo-price-main">
                      {showBefore && (
                        <div className="promo-price-row">
                          <span className="promo-price-label">Antes</span>
                          <span className="promo-price-before">{formatCOP(promo.priceBefore)}</span>
                        </div>
                      )}
                      <div className="promo-price-row promo-price-row--now">
                        <span className="promo-price-label">{showBefore ? 'Ahora' : 'Precio'}</span>
                        <span className="promo-price-now">{formatCOP(promo.priceNow)}</span>
                      </div>
                    </div>
                    {savings > 0 && (
                      <p className="promo-price-save">Ahorras {formatCOP(savings)}</p>
                    )}
                  </div>
                )}

                {buyable && onAddToCart && (
                  <div className="promo-card-actions">
                    <button
                      type="button"
                      className={`promo-buy-btn ${justAdded ? 'promo-buy-btn--added' : ''}`}
                      onClick={() => handleBuy(promo)}
                      disabled={justAdded}
                    >
                      {justAdded ? (
                        <>
                          <Check size={16} />
                          Agregado
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          Agregar
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="promo-buy-btn promo-buy-btn--primary"
                      onClick={() => handleBuyNow(promo)}
                    >
                      Comprar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};

export default PromoCardsGrid;
