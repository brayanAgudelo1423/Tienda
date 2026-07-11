import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCOP } from '../utils/currency';
import { mediaUrl } from '../api/client';

const Cart = ({ items, onRemove }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0; 
  const total = subtotal + shipping;

  return (
    <div className="container cart-container" style={styles.container}>
      <h1 style={styles.pageTitle}>Bolsa</h1>
      
      {items.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>No hay artículos en tu bolsa.</p>
          <Link to="/" className="btn">Ver novedades</Link>
        </div>
      ) : (
        <div className="cart-grid" style={styles.grid}>
          <div style={styles.itemsList}>
            <div style={styles.shippingPromo}>
              <p style={{fontWeight: 700, marginBottom: '0.5rem'}}>Envío y devoluciones gratuitos</p>
              <p style={{fontSize: '0.9rem', color: 'var(--color-text-light)'}}>Los miembros de VirtusMonaco disfrutan de envíos estándar gratuitos y devoluciones gratuitas.</p>
            </div>
            
            {items.map(item => (
              <motion.div key={item.cartId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.item}>
                <div className="cart-item-image" style={styles.imageContainer}>
                  {item.image ? (
                    <img src={mediaUrl(item.image)} alt={item.name} style={styles.image} />
                  ) : (
                    <div className="cart-item-placeholder">Oferta</div>
                  )}
                </div>
                <div style={styles.itemDetails}>
                  <div style={styles.itemHeader}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemPrice}>{formatCOP(item.price)}</p>
                  </div>
                  <p style={styles.itemBrand}>{item.brand}</p>
                  <p style={styles.itemMeta}>
                    {item.isPromotion
                      ? 'Oferta promocional'
                      : `${item.productType} · Talla ${item.selectedSize} · ${item.colorName}`}
                  </p>
                  
                  <div style={styles.itemActions}>
                    <span style={{fontSize: '0.9rem', color: 'var(--color-text-light)'}}>Cantidad: {item.quantity}</span>
                    <button onClick={() => onRemove(item.cartId)} style={styles.removeBtn}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div style={styles.summaryPanel}>
            <h2 style={styles.summaryTitle}>Resumen</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Envío y manipulación estimados</span>
              <span>Gratis</span>
            </div>
            <div style={styles.summaryTotalRow}>
              <span>Total</span>
              <span>{formatCOP(total)}</span>
            </div>
            <Link to="/checkout" style={{ width: '100%', marginTop: '2rem', display: 'block', textAlign: 'center' }} className="btn">
              Pasar por caja
            </Link>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .cart-item-image { width: 100px !important; height: 100px !important; }
          .cart-container { padding: 2rem 1.2rem !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { padding: '3rem 1.2rem', minHeight: '70vh', maxWidth: '1100px', margin: '0 auto' },
  pageTitle: { fontSize: '2rem', fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: '2rem', textTransform: 'none' },
  emptyState: { textAlign: 'center', padding: '4rem 0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', alignItems: 'start' },
  shippingPromo: { padding: '1.5rem', backgroundColor: 'var(--color-bg-alt)', marginBottom: '2rem' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  item: { display: 'flex', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-bg-alt)' },
  imageContainer: { width: '150px', height: '150px', backgroundColor: 'var(--color-bg-alt)', flexShrink: 0 },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  itemDetails: { flex: 1, display: 'flex', flexDirection: 'column' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: '1.1rem', fontWeight: 500, fontFamily: 'var(--font-body)', textTransform: 'none' },
  itemPrice: { fontSize: '1.1rem', fontWeight: 500 },
  itemBrand: { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-light)', marginTop: '0.2rem' },
  itemMeta: { color: 'var(--color-text-light)', fontSize: '0.9rem', marginTop: '0.15rem' },
  itemActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' },
  removeBtn: { color: 'var(--color-text-light)', cursor: 'pointer', transition: 'color 0.2s', border: 'none', background: 'none' },
  summaryPanel: { padding: '0', position: 'sticky', top: '100px' },
  summaryTitle: { fontSize: '1.5rem', fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: '1.5rem', textTransform: 'none' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text)', fontSize: '1rem' },
  summaryTotalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-bg-alt)', fontWeight: 500, fontSize: '1.2rem' }
};

export default Cart;
