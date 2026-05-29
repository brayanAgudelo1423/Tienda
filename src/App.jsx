import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProductsProvider } from './context/ProductsContext';
import StoreApp from './StoreApp';
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <ProductsProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<StoreApp />} />
      </Routes>
    </ProductsProvider>
  );
}

export default App;
