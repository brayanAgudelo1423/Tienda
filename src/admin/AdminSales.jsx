import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { formatCOP } from '../utils/currency';

const PAYMENT_LABELS = {
  'payu-card': 'Tarjeta (PayU)',
  pse: 'PSE',
  contraentrega: 'Contraentrega',
};

const STATUS_LABELS = {
  confirmada: 'Confirmada',
  pendiente_pago: 'Pendiente de pago',
  pagada: 'Pagada',
  rechazada: 'Rechazada',
  completada: 'Completada',
};

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSales(80)
      .then(setSales)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando ventas…</p>;

  return (
    <>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Historial de ventas</h2>

      {sales.length === 0 && (
        <p style={{ color: 'var(--color-text-light)' }}>Aún no hay ventas registradas.</p>
      )}

      {sales.map((sale) => (
        <article
          key={sale.id}
          style={{
            border: '1px solid var(--color-bg-alt)',
            borderRadius: 14,
            padding: '1rem',
            marginBottom: '0.75rem',
            background: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <strong>#{sale.id}</strong>
            <span style={{ fontWeight: 600 }}>{formatCOP(sale.total)}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0 0 0.5rem' }}>
            {new Date(sale.createdAt).toLocaleString('es-CO')}
            {sale.paymentMethod ? ` · ${PAYMENT_LABELS[sale.paymentMethod] ?? sale.paymentMethod}` : ''}
            {sale.status ? ` · ${STATUS_LABELS[sale.status] ?? sale.status}` : ''}
          </p>
          {sale.customerName && (
            <p style={{ fontSize: '0.85rem', margin: '0 0 0.25rem' }}>
              {sale.customerName}
              {sale.customerPhone ? ` · ${sale.customerPhone}` : ''}
            </p>
          )}
          {sale.customerCity && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: 0 }}>
              {sale.customerCity}
            </p>
          )}
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1rem', fontSize: '0.85rem' }}>
            {sale.items.map((item, i) => (
              <li key={i}>
                {item.name} ×{item.quantity} — {formatCOP(item.price * item.quantity)}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </>
  );
};

export default AdminSales;
