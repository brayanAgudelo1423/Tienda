import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminProductForm from './AdminProductForm';
import AdminSales from './AdminSales';
import { api, setAdminToken } from '../api/client';

function AdminGuard({ children }) {
  const token = localStorage.getItem('ozono_admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

const AdminRoutes = () => (
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
    </Route>
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
);

export default AdminRoutes;
