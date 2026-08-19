import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, LogOut, ShoppingBag, Tag } from 'lucide-react';
import { api, setAdminToken, ADMIN_AUTH_EXPIRED_EVENT } from '../api/client';
import BrandLogo from '../components/BrandLogo';
import './admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sessionError, setSessionError] = useState('');

  const logout = () => {
    setAdminToken(null);
    setSessionError('');
    navigate('/admin/login', { replace: true });
  };

  useEffect(() => {
    document.getElementById('boot-splash')?.remove();

    const onExpired = (event) => {
      setSessionError(event.detail?.message || 'Sesión expirada o inválida');
    };
    window.addEventListener(ADMIN_AUTH_EXPIRED_EVENT, onExpired);

    api.getMe().catch((err) => {
      setSessionError(err.message || 'Sesión expirada o inválida');
    });

    return () => window.removeEventListener(ADMIN_AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <BrandLogo variant="admin-bar" asLink={false} />
        <button type="button" onClick={logout} aria-label="Cerrar sesión" title="Cerrar sesión">
          <LogOut size={22} />
        </button>
      </header>

      {sessionError && (
        <div className="admin-session-banner" role="alert">
          <div className="admin-session-banner-text">
            <strong>Sesión expirada o inválida</strong>
            <p>{sessionError}</p>
          </div>
          <button type="button" className="btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      )}

      <main className="admin-content">
        <Outlet context={{ sessionError, logout }} />
      </main>

      <nav className="admin-nav">
        <NavLink to="/admin" end>
          <LayoutDashboard size={20} />
          Inicio
        </NavLink>
        <NavLink to="/admin/productos">
          <Package size={20} />
          Productos
        </NavLink>
        <NavLink to="/admin/ventas">
          <ShoppingBag size={20} />
          Ventas
        </NavLink>
        <NavLink to="/admin/promociones">
          <Tag size={20} />
          Ofertas
        </NavLink>
        <NavLink to="/admin/productos/nuevo">
          <Plus size={20} />
          Nuevo
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminLayout;
