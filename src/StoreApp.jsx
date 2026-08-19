import React, { useEffect, useState } from 'react';
import { forceUnlockPageScroll } from './utils/scrollLock';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import BrandMarquee from './components/BrandMarquee';
import ProductList from './components/ProductList';
import HomeCatalogs from './components/HomeCatalogs';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import Brands from './pages/Brands';
import Lociones from './pages/Lociones';
import Contacto from './pages/Contacto';
import Promociones from './pages/Promociones';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import CheckoutResult from './pages/CheckoutResult';
import RastrearPedido from './pages/RastrearPedido';
import VerTodo from './pages/VerTodo';
import StoreBootSplash from './components/StoreBootSplash';
import { getCartItemId } from './utils/product';

function StoreApp() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const unlock = () => forceUnlockPageScroll();
    const t1 = setTimeout(unlock, 2500);
    const t2 = setTimeout(unlock, 5000);
    window.addEventListener('pageshow', unlock);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('pageshow', unlock);
    };
  }, []);

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
      <StoreBootSplash />
      <Header cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
      <FloatingSocials />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <BrandMarquee />
              <HomeCatalogs />
              <ProductList onAddToCart={addToCart} />
            </main>
          }
        />
        <Route path="/marcas/:brandSlug" element={<Brands onAddToCart={addToCart} />} />
        <Route path="/lociones" element={<Lociones onAddToCart={addToCart} />} />
        <Route path="/lociones/marca/:brandSlug" element={<Lociones onAddToCart={addToCart} />} />
        <Route path="/ver-todo" element={<VerTodo onAddToCart={addToCart} />} />
        <Route path="/cart" element={<Cart items={cartItems} onRemove={removeFromCart} />} />
        <Route path="/checkout" element={<Checkout items={cartItems} onOrderComplete={clearCart} />} />
        <Route path="/checkout/resulto" element={<CheckoutResult />} />
        <Route path="/promociones" element={<Promociones onAddToCart={addToCart} />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/rastrear-pedido" element={<RastrearPedido />} />
        <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default StoreApp;
