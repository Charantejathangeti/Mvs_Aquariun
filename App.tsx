
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CartPage } from './app/(main)/cart/page';
import { CheckoutForm } from './app/(main)/cart/checkout/form';
import { SuccessPage } from './app/(main)/cart/checkout/success/page';
import { AdminProductsPage } from './app/(admin)/products/fish/page';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { CartItem, Product } from './types';
import { AuthService } from './services/authService';

// Updated logic: Check authentication status via AuthService
interface ProtectedAdminRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  // Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(AuthService.isAuthenticated());
  
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Check session on mount
    setIsAdminLoggedIn(AuthService.isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, 50) } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty > 50) return;
    if (qty < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCartItems([]);

  return (
    <HashRouter>
      <Layout 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        isAdmin={isAdminLoggedIn}
        onLogout={handleLogout}
      >
        <Routes>
          {/* Public Shop Routes - No Login Required */}
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={
            <CartPage 
              cartItems={cartItems} 
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          } />
          <Route path="/cart/checkout" element={
            <CheckoutForm cartItems={cartItems} clearCart={clearCart} />
          } />
          <Route path="/cart/checkout/success" element={<SuccessPage />} />
          
          {/* Admin Login */}
          <Route path="/login" element={
            isAdminLoggedIn ? <Navigate to="/admin/products/fish" /> : <AdminLoginPage onLogin={handleLoginSuccess} />
          } />
          
          {/* Protected Admin Routes */}
          <Route path="/admin/products/fish" element={
            <ProtectedAdminRoute isAuthenticated={isAdminLoggedIn}>
              <AdminProductsPage />
            </ProtectedAdminRoute>
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
