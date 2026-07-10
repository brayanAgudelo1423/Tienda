import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatCOP } from '../utils/currency';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getSalesStats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <p style={{ color: '#b91c1c' }}>{error}</p>;
  }

  if (!stats) {
    return <p>Cargando estadísticas…</p>;
  }

  return (
    <>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Resumen de ventas</h2>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span>Ventas totales</span>
          <strong>{stats.totalSales}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Ingresos (COP)</span>
          <strong>{formatCOP(stats.revenue)}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Hoy</span>
          <strong>
            {stats.todaySales} · {formatCOP(stats.todayRevenue)}
          </strong>
        </div>
        <div className="admin-stat-card">
          <span>Este mes</span>
          <strong>
            {stats.monthSales} · {formatCOP(stats.monthRevenue)}
          </strong>
        </div>
        <div className="admin-stat-card" style={{ gridColumn: '1 / -1' }}>
          <span>Artículos vendidos</span>
          <strong>{stats.itemsSold}</strong>
        </div>
      </div>

      <Link to="/admin/productos" className="btn" style={{ width: '100%', marginBottom: '0.75rem' }}>
        Gestionar productos
      </Link>
      <Link
        to="/admin/promociones"
        className="btn btn-outline"
        style={{ width: '100%', marginBottom: '0.75rem', display: 'block', textAlign: 'center' }}
      >
        Gestionar promociones
      </Link>
      <Link
        to="/admin/ventas"
        className="btn btn-outline"
        style={{ width: '100%', display: 'block', textAlign: 'center' }}
      >
        Ver historial de ventas
      </Link>
    </>
  );
};

export default AdminDashboard;
