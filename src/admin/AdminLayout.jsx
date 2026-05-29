import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, LogOut, ShoppingBag } from 'lucide-react';
import { setAdminToken } from '../api/client';
import './admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    setAdminToken(null);
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <h1 className="brand-logo">OZONO Admin</h1>
        <button type="button" onClick={logout} aria-label="Cerrar sesión">
          <LogOut size={22} />
        </button>
      </header>

      <main className="admin-content">
        <Outlet />
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
        <NavLink to="/admin/productos/nuevo">
          <Plus size={20} />
          Nuevo
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminLayout;
