import React, { useEffect, useState } from 'react';
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
import { displayStoreText } from '../utils/displayText';
import { displayStoreText } from '../utils/displayText';
import BrandLogo from './BrandLogo';

const FALLBACK_PAYMENT_METHODS = [
  {
    id: 'mercadopago',
    label: 'Pago en línea',
    desc: 'Tarjetas, PSE, Nequi, Daviplata, Efecty y más medios en Colombia.',
  },
  { id: 'contraentrega', label: 'Pago contraentrega', desc: 'Pagas en efectivo o datáfono al recibir' },
];

const MP_AVAILABLE_METHODS = [
  'Tarjetas crédito/débito',
  'PSE — todos los bancos',
  'Nequi',
  'Daviplata',
  'Efecty',
  'Baloto',
  'Pago en efectivo',
];

const SUCCESS_COPY = {
  mercadopago: {
    title: 'Redirigiendo al pago…',
    body: 'Elige tu medio de pago: tarjeta, PSE, Nequi, Daviplata, Efecty u otro disponible.',
  },
  contraentrega: {
    title: '¡Compra exitosa!',
    body: 'Tu compra fue registrada correctamente. Pronto nos contactaremos contigo para coordinar la entrega.',
  },
};

const MP_MIN_AMOUNT_COP = 10000;

const Checkout = ({ items, onOrderComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [completedPayment, setCompletedPayment] = useState('contraentrega');
  const [error, setError] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(FALLBACK_PAYMENT_METHODS);
  const [payment, setPayment] = useState('mercadopago');

  const isMercadoPago = payment === 'mercadopago';

  const normalizeMethods = (methods) =>
    (methods ?? [])
      .filter((m) => m.id === 'mercadopago' || m.id === 'contraentrega')
      .map((m) =>
        m.id === 'mercadopago'
          ? { ...m, label: 'Pago en línea', desc: FALLBACK_PAYMENT_METHODS[0].desc }
          : m
      );

  useEffect(() => {
    api
      .getPaymentMethods()
      .then(({ methods }) => {
        const filtered = normalizeMethods(methods);
        if (filtered.length) {
          setPaymentMethods(filtered);
          const firstOnline = filtered.find((m) => m.id !== 'contraentrega');
          if (firstOnline) setPayment(firstOnline.id);
        }
      })
      .catch(() => {
        setPaymentMethods(FALLBACK_PAYMENT_METHODS);
        setPayment('mercadopago');
      });
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    const form = new FormData(e.target);
    const customer = {
      name: form.get('fullName'),
      email: form.get('email'),
      phone: form.get('phone'),
      city: `${form.get('city')}, ${form.get('state')}`,
      address: `${form.get('address')} — C.P. ${form.get('zip')}`,
      street: form.get('address'),
      cityName: form.get('city'),
      stateName: form.get('state'),
      zip: form.get('zip'),
      documentType: form.get('documentType') || 'CC',
      documentNumber: String(form.get('documentNumber') || '').trim(),
    };

    const saleItems = items.map((item) => ({
      id: item.promotionId ?? item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
      size: item.isPromotion ? 'Promoción' : item.selectedSize,
      color: item.isPromotion ? 'Oferta' : item.colorName,
      image: item.image,
      isPromotion: Boolean(item.isPromotion),
    }));

    try {
      if (isMercadoPago && total < MP_MIN_AMOUNT_COP) {
        throw new Error(
          `Mercado Pago exige un mínimo de $${MP_MIN_AMOUNT_COP.toLocaleString('es-CO')} COP. Agrega más productos o elige contraentrega.`
        );
      }

      const sale = await api.createSale({
        total,
        subtotal,
        customer,
        items: saleItems,
        paymentMethod: payment,
      });

      if (isMercadoPago) {
        if (!customer.documentNumber) {
          throw new Error('Ingresa tu número de documento para pagar con Mercado Pago');
        }

        const mp = await api.createMercadoPagoCheckout({
          saleId: sale.id,
          customer,
        });

        onOrderComplete?.();
        window.location.href = mp.initPoint;
        return;
      }

      setOrderId(sale.id);
      setCompletedPayment(payment);
      setIsSuccess(true);
      onOrderComplete?.();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'No se pudo registrar el pedido. Intenta de nuevo.');
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
    const copy = SUCCESS_COPY[completedPayment] ?? SUCCESS_COPY.contraentrega;

    return (
      <motion.div
        className="checkout-page checkout-success"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="checkout-success-icon">
          <CheckCircle size={64} strokeWidth={1.5} />
        </div>
        <h1>{copy.title}</h1>
        {orderId && completedPayment !== 'contraentrega' && (
          <p className="checkout-order-id">Pedido #{orderId}</p>
        )}
        <p>{copy.body}</p>
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
          <BrandLogo variant="checkout" className="checkout-brand-logo" />
          <p className="checkout-step">Paso 2 de 2</p>
          <h1>Finalizar compra</h1>
          <p className="checkout-subtitle">Completa tus datos para recibir tu pedido</p>
        </header>

        {error && (
          <div className="checkout-error" role="alert">
            {error}
          </div>
        )}

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

            {isMercadoPago && (
            <section className="checkout-card">
              <h2>
                <Lock size={18} />
                Identificación (requerida para pago en línea)
              </h2>
              <div className="checkout-field-row">
                <div className="checkout-field">
                  <label htmlFor="documentType">Tipo de documento</label>
                  <select id="documentType" name="documentType" defaultValue="CC">
                    <option value="CC">Cédula de ciudadanía</option>
                    <option value="CE">Cédula de extranjería</option>
                    <option value="NIT">NIT</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>
                <div className="checkout-field">
                  <label htmlFor="documentNumber">Número de documento</label>
                  <input
                    id="documentNumber"
                    name="documentNumber"
                    type="text"
                    inputMode="numeric"
                    required={isMercadoPago}
                    placeholder="Ej. 1020304050"
                  />
                </div>
              </div>
            </section>
            )}

            <section className="checkout-section">
              <h2>
                <CreditCard size={18} />
                Método de pago
              </h2>

              <div className="payment-options">
                {paymentMethods.map((m) => (
                  <label key={m.id} className={`payment-option ${payment === m.id ? 'is-active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id)}
                    />
                    <span className="payment-option__text">
                      <strong>{m.label}</strong>
                      <small>{m.desc}</small>
                    </span>
                  </label>
                ))}
              </div>

              {isMercadoPago && (
                <div className="checkout-payu-methods">
                  <p className="checkout-payu-methods-title">Medios disponibles:</p>
                  <ul className="checkout-payu-methods-list">
                    {MP_AVAILABLE_METHODS.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="checkout__payu-note">
                Al pagar en línea serás redirigido a una pasarela segura donde podrás elegir tarjeta,
                PSE, Nequi, Daviplata, efectivo y más. VirtusMonaco nunca almacena los datos de tu tarjeta.
              </p>
            </section>

            <button type="submit" className="btn checkout-submit-desktop" disabled={isProcessing}>
              {isProcessing ? 'Procesando…' : 'Pagar'}
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
            {isProcessing ? 'Procesando…' : 'Pagar'}
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
            {item.image ? (
              <img src={mediaUrl(item.image)} alt={item.name} />
            ) : (
              <div className="cart-item-placeholder">Oferta</div>
            )}
            <span className="checkout-order-qty">{item.quantity}</span>
          </div>
          <div className="checkout-order-info">
            <p className="checkout-order-brand">{displayStoreText(item.brand)}</p>
            <p className="checkout-order-name">{displayStoreText(item.name)}</p>
            {!compact && !item.isPromotion && item.selectedSize && (
              <p className="checkout-order-meta">
                Talla {item.selectedSize} · {item.colorName}
              </p>
            )}
            {!compact && item.isPromotion && (
              <p className="checkout-order-meta">Oferta promocional</p>
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
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .checkout-brand-logo {
    display: flex;
    justify-content: center;
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

  .checkout-card h2,
  .checkout-section h2 {
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

  .checkout-section {
    background: #fff;
    border: 1px solid var(--color-bg-alt);
    border-radius: 14px;
    padding: 1.25rem 1.15rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }

  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .payment-option {
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1px solid var(--line-light, #e5e5e5);
    border-radius: var(--radius-sm, 10px);
    padding: 16px;
    cursor: pointer;
    transition: border-color var(--t-fast, 0.2s) var(--ease, ease), background var(--t-fast, 0.2s) var(--ease, ease);
  }

  .payment-option:hover {
    border-color: var(--c-gold, #d4af37);
  }

  .payment-option.is-active {
    border-color: var(--color-primary);
    background: var(--c-ivory-dim, #f9f9f7);
  }

  .payment-option input {
    accent-color: var(--c-gold-dim, #e8d5b7);
    width: 18px;
    height: 18px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .payment-option__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .payment-option__text strong {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-primary);
  }

  .payment-option__text small {
    color: #6b6a66;
    font-size: 0.76rem;
  }

  .checkout__payu-note {
    margin-top: 16px;
    font-size: 0.76rem;
    color: #6b6a66;
    margin-bottom: 0;
  }

  .checkout-payu-methods {
    margin-top: 14px;
    padding: 12px 14px;
    background: var(--color-bg-alt);
    border-radius: 10px;
  }

  .checkout-payu-methods-title {
    margin: 0 0 8px;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  .checkout-payu-methods-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .checkout-payu-methods-list li {
    font-size: 0.72rem;
    padding: 0.3rem 0.55rem;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 999px;
    color: var(--color-text-light);
  }

  .checkout-mp-tip {
    margin: 10px 0 0;
    font-size: 0.76rem;
    line-height: 1.45;
    color: var(--color-text-light);
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

  .checkout-field select {
    width: 100%;
    padding: 0.9rem 1rem;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    font-size: 1rem;
    font-family: var(--font-body);
    background: #fafafa;
    color: var(--color-primary);
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

  .checkout-order-id {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
    margin: -0.5rem auto 1rem !important;
  }

  .checkout-error {
    margin-bottom: 1rem;
    padding: 0.9rem 1rem;
    border-radius: 10px;
    background: #fff5f5;
    border: 1px solid #f5c2c2;
    color: #9b1c1c;
    font-size: 0.9rem;
    line-height: 1.45;
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
