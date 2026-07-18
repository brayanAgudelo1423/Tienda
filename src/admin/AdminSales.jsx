import React, { useEffect, useState } from 'react';
import { api, mediaUrl } from '../api/client';
import { formatCOP } from '../utils/currency';
import { displayStoreText } from '../utils/displayText';

const PAYMENT_LABELS = {
  mercadopago: 'Pago en línea',
  'payu-online': 'PayU',
  'payu-card': 'PayU',
  pse: 'PayU',
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
  const [deletingId, setDeletingId] = useState(null);

  const loadSales = () => {
    setLoading(true);
    api
      .getSales(80)
      .then(setSales)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSales();
  }, []);

  const removeSale = async (id) => {
    if (!window.confirm(`¿Eliminar el pedido #${id} permanentemente de la base de datos?`)) return;
    setDeletingId(id);
    try {
      await api.deleteSale(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || 'No se pudo eliminar el pedido');
    } finally {
      setDeletingId(null);
    }
  };

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
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <strong style={{ fontSize: '1.05rem' }}>Pedido #{sale.id}</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0.25rem 0 0' }}>
                {new Date(sale.createdAt).toLocaleString('es-CO')}
                {sale.paymentMethod ? ` · ${PAYMENT_LABELS[sale.paymentMethod] ?? sale.paymentMethod}` : ''}
                {sale.status ? ` · ${STATUS_LABELS[sale.status] ?? sale.status}` : ''}
              </p>
            </div>
            <strong style={{ fontSize: '1.05rem' }}>{formatCOP(sale.total)}</strong>
          </div>

          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.75rem',
              background: 'var(--color-bg-alt)',
              borderRadius: 10,
              fontSize: '0.85rem',
            }}
          >
            <p style={{ margin: '0 0 0.35rem', fontWeight: 600 }}>Datos del cliente</p>
            {sale.customerName && <p style={{ margin: '0 0 0.2rem' }}>{sale.customerName}</p>}
            {sale.customerEmail && <p style={{ margin: '0 0 0.2rem' }}>{sale.customerEmail}</p>}
            {sale.customerPhone && <p style={{ margin: '0 0 0.2rem' }}>{sale.customerPhone}</p>}
            {sale.customerDocument && <p style={{ margin: '0 0 0.2rem' }}>Doc: {sale.customerDocument}</p>}
            {sale.customerAddress && <p style={{ margin: '0 0 0.2rem' }}>{sale.customerAddress}</p>}
            {sale.customerCity && <p style={{ margin: 0 }}>{sale.customerCity}</p>}
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Productos</p>
            {sale.items.map((item, i) => (
              <div
                key={`${item.id ?? item.name}-${i}`}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  marginBottom: '0.65rem',
                  paddingBottom: '0.65rem',
                  borderBottom: i < sale.items.length - 1 ? '1px solid #eee' : 'none',
                }}
              >
                {item.image && (
                  <img
                    src={mediaUrl(item.image)}
                    alt=""
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: 'cover',
                      borderRadius: 8,
                      flexShrink: 0,
                      background: '#f5f5f5',
                    }}
                  />
                )}
                <div style={{ flex: 1, fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 0.15rem', fontWeight: 500 }}>
                    {displayStoreText(item.brand ? `${item.brand} — ${item.name}` : item.name)}
                  </p>
                  <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
                    Cant: {item.quantity}
                    {item.size ? ` · Talla ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                  </p>
                  <p style={{ margin: '0.15rem 0 0' }}>{formatCOP(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="admin-btn-sm danger"
            style={{ marginTop: '0.75rem' }}
            disabled={deletingId === sale.id}
            onClick={() => removeSale(sale.id)}
          >
            {deletingId === sale.id ? 'Eliminando…' : 'Eliminar este pedido'}
          </button>
        </article>
      ))}
    </>
  );
};

export default AdminSales;
