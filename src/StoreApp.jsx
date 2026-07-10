import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import BrandMarquee from './components/BrandMarquee';
import ProductList from './components/ProductList';
import PromotionsSection from './components/PromotionsSection';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import Brands from './pages/Brands';
import Lociones from './pages/Lociones';
import Contacto from './pages/Contacto';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import CheckoutResult from './pages/CheckoutResult';
import { getCartItemId } from './utils/product';

function StoreApp() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const cartId = getCartItemId(product);
    setCartItems((prev) => {
      const exists = prev.find((item) => item.cartId === cartId);
      if (exists) {
        return prev.map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, cartId, quantity: 1 }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="app">
      <Header cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
      <FloatingSocials />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <BrandMarquee />
              <PromotionsSection />
              <ProductList onAddToCart={addToCart} />
            </main>
          }
        />
        <Route path="/marcas/:brandSlug" element={<Brands onAddToCart={addToCart} />} />
        <Route path="/lociones" element={<Lociones onAddToCart={addToCart} />} />
        <Route path="/lociones/marca/:brandSlug" element={<Lociones onAddToCart={addToCart} />} />
        <Route path="/cart" element={<Cart items={cartItems} onRemove={removeFromCart} />} />
        <Route path="/checkout" element={<Checkout items={cartItems} onOrderComplete={clearCart} />} />
        <Route path="/checkout/resulto" element={<CheckoutResult />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default StoreApp;
