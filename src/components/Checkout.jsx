import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api, mediaUrl } from '../api/client';
import { formatCOP } from '../utils/currency';

const Checkout = ({ items }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const form = new FormData(e.target);
    const customer = {
      name: form.get('fullName'),
      email: form.get('email'),
      phone: form.get('phone'),
      city: `${form.get('city')}, ${form.get('state')}`,
      address: `${form.get('address')} — C.P. ${form.get('zip')}`,
    };

    const saleItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
      size: item.selectedSize,
      color: item.colorName,
    }));

    try {
      await api.createSale({
        total,
        subtotal,
        customer,
        items: saleItems,
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="checkout-page checkout-empty">
        <p>Tu bolsa está vacía.</p>
        <Link to="/" className="btn">
          Seguir comprando
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        className="checkout-page checkout-success"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="checkout-success-icon">
          <CheckCircle size={64} strokeWidth={1.5} />
        </div>
        <h1>¡Pago exitoso!</h1>
        <p>Gracias por tu compra. Recibirás un correo con el estado de tu pedido.</p>
        <Link to="/" className="btn">
          Volver a la tienda
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <p className="checkout-step">Paso 2 de 2</p>
          <h1>Finalizar compra</h1>
          <p className="checkout-subtitle">Completa tus datos para recibir tu pedido</p>
        </header>

        {/* Resumen colapsable en móvil */}
        <div className="checkout-summary-mobile">
          <button
            type="button"
            className="checkout-summary-toggle"
            onClick={() => setSummaryOpen(!summaryOpen)}
            aria-expanded={summaryOpen}
          >
            <span>
              <strong>{items.length}</strong> {items.length === 1 ? 'artículo' : 'artículos'} ·{' '}
              <strong>{formatCOP(total)}</strong>
            </span>
            {summaryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {summaryOpen && (
            <div className="checkout-summary-mobile-body">
              <OrderSummary items={items} subtotal={subtotal} total={total} compact />
            </div>
          )}
        </div>

        <div className="checkout-grid">
          <form id="checkout-form" onSubmit={handleSubmit} className="checkout-form">
            <section className="checkout-card">
              <h2>
                <User size={18} />
                Datos de contacto
              </h2>
              <div className="checkout-field">
                <label htmlFor="fullName">Nombre completo</label>
                <input id="fullName" name="fullName" type="text" required placeholder="Ej. Juan Pérez" />
              </div>
              <div className="checkout-field-row">
                <div className="checkout-field">
                  <label htmlFor="email">
                    <Mail size={14} />
                    Correo
                  </label>
                  <input id="email" name="email" type="email" required placeholder="correo@ejemplo.com" />
                </div>
                <div className="checkout-field">
                  <label htmlFor="phone">
                    <Phone size={14} />
                    Teléfono
                  </label>
                  <input id="phone" name="phone" type="tel" required placeholder="+57 300 123 4567" />
                </div>
              </div>
            </section>

            <section className="checkout-card">
              <h2>
                <MapPin size={18} />
                Dirección de envío
              </h2>
              <div className="checkout-field">
                <label htmlFor="address">Calle y número</label>
                <input id="address" name="address" type="text" required placeholder="Calle 45 # 12-34, Apto 501" />
              </div>
              <div className="checkout-field-row checkout-field-row-3">
                <div className="checkout-field">
                  <label htmlFor="city">Ciudad</label>
                  <input id="city" name="city" type="text" required placeholder="Bogotá" />
                </div>
                <div className="checkout-field">
                  <label htmlFor="state">Estado</label>
                  <input id="state" name="state" type="text" required placeholder="Cundinamarca" />
                </div>
                <div className="checkout-field">
                  <label htmlFor="zip">C.P.</label>
                  <input id="zip" name="zip" type="text" required placeholder="110111" inputMode="numeric" />
                </div>
              </div>
            </section>

            <section className="checkout-card">
              <h2>
                <CreditCard size={18} />
                Método de pago
                <span className="checkout-badge">
                  <Lock size={12} />
                  Simulado
                </span>
              </h2>
              <div className="checkout-field">
                <label htmlFor="cardNumber">Número de tarjeta</label>
                <input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  required
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="cc-number"
                />
              </div>
              <div className="checkout-field-row">
                <div className="checkout-field">
                  <label htmlFor="expiry">Vencimiento</label>
                  <input id="expiry" name="expiry" type="text" required placeholder="MM/AA" />
                </div>
                <div className="checkout-field">
                  <label htmlFor="cvc">CVC</label>
                  <input id="cvc" name="cvc" type="text" required placeholder="123" inputMode="numeric" />
                </div>
              </div>
            </section>

            <button type="submit" className="btn checkout-submit-desktop" disabled={isProcessing}>
              {isProcessing ? 'Procesando…' : `Pagar ${formatCOP(total)}`}
            </button>
          </form>

          <aside className="checkout-summary-desktop">
            <OrderSummary items={items} subtotal={subtotal} total={total} />
          </aside>
        </div>
      </div>

      {/* Barra fija de pago en móvil */}
      <div className="checkout-sticky-bar">
        <div className="checkout-sticky-inner">
          <div className="checkout-sticky-total">
            <span>Total</span>
            <strong>{formatCOP(total)}</strong>
          </div>
          <button
            type="submit"
            form="checkout-form"
            className="btn checkout-sticky-btn"
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando…' : 'Pagar ahora'}
          </button>
        </div>
      </div>

      <style>{checkoutStyles}</style>
    </div>
  );
};

const OrderSummary = ({ items, subtotal, total, compact = false }) => (
  <div className={`checkout-order ${compact ? 'checkout-order-compact' : ''}`}>
    {!compact && <h3>Resumen del pedido</h3>}
    <ul className="checkout-order-list">
      {items.map((item) => (
        <li key={item.cartId} className="checkout-order-item">
          <div className="checkout-order-thumb">
            <img src={mediaUrl(item.image)} alt={item.name} />
            <span className="checkout-order-qty">{item.quantity}</span>
          </div>
          <div className="checkout-order-info">
            <p className="checkout-order-brand">{item.brand}</p>
            <p className="checkout-order-name">{item.name}</p>
            {!compact && item.selectedSize && (
              <p className="checkout-order-meta">
                Talla {item.selectedSize} · {item.colorName}
              </p>
            )}
          </div>
          <span className="checkout-order-price">{formatCOP(item.price * item.quantity)}</span>
        </li>
      ))}
    </ul>
    <div className="checkout-order-rows">
      <div className="checkout-order-row">
        <span>Subtotal</span>
        <span>{formatCOP(subtotal)}</span>
      </div>
      <div className="checkout-order-row">
        <span>Envío</span>
        <span className="checkout-free">Gratis</span>
      </div>
      <div className="checkout-order-row checkout-order-total">
        <span>Total</span>
        <span>{formatCOP(total)}</span>
      </div>
    </div>
  </div>
);

const checkoutStyles = `
  .checkout-page {
    min-height: 70vh;
    padding-bottom: 6rem;
    background: var(--color-bg);
  }

  .checkout-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem 1.2rem 2rem;
  }

  .checkout-header {
    margin-bottom: 1.5rem;
  }

  .checkout-step {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-secondary);
    margin: 0 0 0.5rem;
  }

  .checkout-header h1 {
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 500;
    margin: 0 0 0.35rem;
    text-transform: none;
  }

  .checkout-subtitle {
    font-size: 0.95rem;
    color: var(--color-text-light);
    margin: 0;
  }

  .checkout-summary-mobile {
    display: block;
    margin-bottom: 1.25rem;
    background: var(--color-bg-alt);
    border-radius: 12px;
    overflow: hidden;
  }

  .checkout-summary-desktop {
    display: none;
  }

  .checkout-summary-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.15rem;
    font-size: 0.95rem;
    color: var(--color-primary);
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
  }

  .checkout-summary-mobile-body {
    padding: 0 1.15rem 1.15rem;
    border-top: 1px solid rgba(0,0,0,0.06);
  }

  .checkout-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .checkout-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .checkout-card {
    background: #fff;
    border: 1px solid var(--color-bg-alt);
    border-radius: 14px;
    padding: 1.25rem 1.15rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }

  .checkout-card h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1.15rem;
    text-transform: none;
    letter-spacing: 0;
    color: var(--color-primary);
  }

  .checkout-badge {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--color-text-light);
    background: var(--color-bg-alt);
    padding: 0.25rem 0.5rem;
    border-radius: 20px;
  }

  .checkout-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .checkout-field:last-child {
    margin-bottom: 0;
  }

  .checkout-field label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-light);
  }

  .checkout-field input {
    width: 100%;
    padding: 0.9rem 1rem;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    font-size: 1rem;
    font-family: var(--font-body);
    background: #fafafa;
    color: var(--color-primary);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
    appearance: none;
  }

  .checkout-field input:focus {
    outline: none;
    border-color: var(--color-primary);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(17,17,17,0.08);
  }

  .checkout-field-row {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .checkout-submit-desktop {
    display: none;
    width: 100%;
    margin-top: 0.5rem;
    padding: 1.1rem;
    font-size: 1rem;
  }

  .checkout-sticky-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 90;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--color-bg-alt);
    padding: 0.85rem 1.2rem calc(0.85rem + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -8px 24px rgba(0,0,0,0.08);
  }

  .checkout-sticky-inner {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .checkout-sticky-total {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .checkout-sticky-total span {
    font-size: 0.75rem;
    color: var(--color-text-light);
  }

  .checkout-sticky-total strong {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .checkout-sticky-btn {
    flex: 1;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    border-radius: 30px;
  }

  .checkout-order h3 {
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1.25rem;
    text-transform: none;
  }

  .checkout-order-list {
    list-style: none;
    margin: 0 0 1.25rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .checkout-order-item {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
  }

  .checkout-order-thumb {
    position: relative;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    background: var(--color-bg-alt);
  }

  .checkout-order-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .checkout-order-qty {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background: var(--color-primary);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 600;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkout-order-info {
    flex: 1;
    min-width: 0;
  }

  .checkout-order-brand {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-light);
    margin: 0;
  }

  .checkout-order-name {
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0.15rem 0 0;
    line-height: 1.3;
  }

  .checkout-order-meta {
    font-size: 0.8rem;
    color: var(--color-text-light);
    margin: 0.2rem 0 0;
  }

  .checkout-order-price {
    font-size: 0.9rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .checkout-order-rows {
    border-top: 1px solid rgba(0,0,0,0.08);
    padding-top: 1rem;
  }

  .checkout-order-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-light);
  }

  .checkout-free {
    color: #1a7f4b;
    font-weight: 500;
  }

  .checkout-order-total {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0,0,0,0.08);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 0;
  }

  .checkout-order-total span:last-child {
    color: var(--color-secondary);
  }

  .checkout-empty,
  .checkout-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 1.5rem;
    min-height: 60vh;
  }

  .checkout-success-icon {
    color: var(--color-secondary);
    margin-bottom: 1.5rem;
  }

  .checkout-success h1 {
    font-size: 1.75rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    text-transform: none;
  }

  .checkout-success p {
    font-size: 1rem;
    color: var(--color-text-light);
    max-width: 320px;
    margin: 0 auto 2rem;
    line-height: 1.5;
  }

  .checkout-empty p {
    margin-bottom: 1.5rem;
    color: var(--color-text-light);
  }

  @media (min-width: 640px) {
    .checkout-field-row {
      flex-direction: row;
      gap: 1rem;
    }

    .checkout-field-row .checkout-field {
      flex: 1;
    }

    .checkout-field-row-3 .checkout-field:last-child {
      flex: 0 0 100px;
    }
  }

  @media (min-width: 900px) {
    .checkout-page {
      padding-bottom: 4rem;
    }

    .checkout-container {
      padding: 3rem 2rem;
    }

    .checkout-header h1 {
      font-size: 2.25rem;
    }

    .checkout-summary-mobile {
      display: none;
    }

    .checkout-summary-desktop {
      display: block;
      position: sticky;
      top: 100px;
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 3rem;
      align-items: start;
    }

    .checkout-submit-desktop {
      display: inline-flex;
    }

    .checkout-sticky-bar {
      display: none;
    }

    .checkout-summary-desktop .checkout-order {
      background: var(--color-bg-alt);
      border-radius: 14px;
      padding: 1.75rem;
    }
  }
`;

export default Checkout;
