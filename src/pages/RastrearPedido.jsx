import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search } from 'lucide-react';
import { api } from '../api/client';
import { formatCOP } from '../utils/currency';
import { BRAND } from '../config/brand';

const STATUS_LABELS = {
  confirmada: 'Confirmado — en preparación',
  pendiente_pago: 'Pendiente de pago',
  pagada: 'Pagado — en preparación',
  rechazada: 'Pago rechazado',
};

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
            <div className="track-result-meta">
              <span>Fecha: {new Date(order.createdAt).toLocaleString('es-CO')}</span>
              <span>Total: {formatCOP(order.total)}</span>
              {order.paymentMethod && <span>Pago: {order.paymentMethod}</span>}
            </div>
            <ul className="track-result-items">
              {order.items.map((item, i) => (
                <li key={`${item.name}-${i}`}>
                  <span>
                    {item.name} × {item.quantity}
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
    </main>
  );
};

export default RastrearPedido;
