import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminProductForm from './AdminProductForm';
import AdminSales from './AdminSales';
import AdminPromotions from './AdminPromotions';

function removeBootSplash() {
  document.getElementById('boot-splash')?.remove();
  try {
    sessionStorage.setItem('vm_boot_done', '1');
  } catch {
    /* ignore */
  }
}

function AdminGuard({ children }) {
  const token = localStorage.getItem('ozono_admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

const AdminRoutes = () => {
  useEffect(() => {
    removeBootSplash();
  }, []);

  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="productos/nuevo" element={<AdminProductForm />} />
        <Route path="productos/:id" element={<AdminProductForm />} />
        <Route path="ventas" element={<AdminSales />} />
        <Route path="promociones" element={<AdminPromotions />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
