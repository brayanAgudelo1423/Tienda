import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProductsProvider } from './context/ProductsContext';
import { PromotionsProvider } from './context/PromotionsContext';
import StoreApp from './StoreApp';
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <ProductsProvider>
      <PromotionsProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<StoreApp />} />
        </Routes>
      </PromotionsProvider>
    </ProductsProvider>
  );
}

export default App;
