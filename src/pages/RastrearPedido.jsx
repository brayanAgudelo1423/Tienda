import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Truck } from 'lucide-react';
import { api } from '../api/client';
import { formatCOP } from '../utils/currency';
import { displayStoreText } from '../utils/displayText';
import { BRAND } from '../config/brand';

const STATUS_LABELS = {
  confirmada: 'Confirmado — en preparación',
  pendiente_pago: 'Pendiente de pago',
  pagada: 'Pagado — en preparación para envío',
  rechazada: 'Pago rechazado',
};

function shippingMessage(status) {
  if (status === 'rechazada') {
    return 'Tu pago no fue aprobado. Realiza un nuevo pedido o contáctanos si necesitas ayuda.';
  }
  if (status === 'pendiente_pago') {
    return 'Estamos esperando la confirmación del pago. Cuando se apruebe, prepararemos tu pedido para envío con Coordinadora.';
  }
  return 'Tu pedido será enviado por Coordinadora. Te enviaremos la guía de rastreo por correo y WhatsApp en cuanto despachemos el paquete.';
}

const RastrearPedido = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const result = await api.trackOrder(orderId.trim(), email.trim());
      setOrder(result);
    } catch (err) {
      setError(err.message || 'No se encontró el pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="track-page">
      <section className="track-hero">
        <div className="container track-hero-inner">
          <p className="track-hero-tag">Seguimiento</p>
          <h1>Rastrea tu pedido</h1>
          <p className="track-hero-sub">
            Ingresa el número de pedido y el correo que usaste al comprar en {BRAND.name}.
          </p>
        </div>
      </section>

      <div className="container track-content">
        <form className="track-form" onSubmit={handleSubmit}>
          <div className="track-field">
            <label htmlFor="orderId">Número de pedido</label>
            <input
              id="orderId"
              type="number"
              min="1"
              required
              placeholder="Ej: 12"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className="track-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn track-submit" disabled={loading}>
            <Search size={18} />
            {loading ? 'Buscando…' : 'Consultar pedido'}
          </button>
        </form>

        {error && (
          <div className="track-error" role="alert">
            {error}
          </div>
        )}

        {order && (
          <div className="track-result">
            <div className="track-result-head">
              <Package size={28} />
              <div>
                <h2>Pedido #{order.id}</h2>
                <p>{STATUS_LABELS[order.status] || order.status}</p>
              </div>
            </div>

            <div className="track-shipping-box">
              <Truck size={22} />
              <div>
                <strong>Envío con Coordinadora</strong>
                <p>{shippingMessage(order.status)}</p>
                {order.status !== 'rechazada' && order.status !== 'pendiente_pago' && (
                  <p className="track-shipping-note">
                    Con tu guía podrás rastrear el paquete en{' '}
                    <a href="https://www.coordinadora.com/rastreo" target="_blank" rel="noreferrer">
                      coordinadora.com
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>

            <div className="track-result-meta">
              <span>Fecha: {new Date(order.createdAt).toLocaleString('es-CO')}</span>
              <span>Total: {formatCOP(order.total)}</span>
              {order.paymentMethod && <span>Pago: {order.paymentMethod === 'mercadopago' ? 'En línea' : order.paymentMethod}</span>}
            </div>
            <ul className="track-result-items">
              {order.items.map((item, i) => (
                <li key={`${item.name}-${i}`}>
                  <span>
                    {displayStoreText(item.brand ? `${item.brand} — ${item.name}` : item.name)} × {item.quantity}
                  </span>
                  <span>{formatCOP(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="track-result-help">
              ¿Necesitas ayuda?{' '}
              <Link to="/contacto">Contáctanos</Link> o escríbenos por WhatsApp.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .track-shipping-box {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
          margin: 1rem 0;
          padding: 1rem;
          background: var(--color-bg-alt);
          border-radius: 12px;
        }
        .track-shipping-box strong {
          display: block;
          margin-bottom: 0.35rem;
        }
        .track-shipping-box p {
          margin: 0;
          color: var(--color-text-light);
          line-height: 1.5;
          font-size: 0.92rem;
        }
        .track-shipping-note {
          margin-top: 0.5rem !important;
        }
        .track-shipping-box svg {
          flex-shrink: 0;
          color: var(--color-secondary);
        }
      `}</style>
    </main>
  );
};

export default RastrearPedido;
