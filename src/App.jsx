import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider';
import CartProvider from './cart/CartProvider';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import SellerApply from './pages/SellerApply';
import SellerProducts from './pages/SellerProducts';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route
              path="/seller/apply"
              element={
                <RequireAuth>
                  <SellerApply />
                </RequireAuth>
              }
            />
            <Route
              path="/seller/products"
              element={
                <RequireAuth roles={['SELLER']}>
                  <SellerProducts />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="*"
              element={
                <main className="page">
                  <p>Page not found.</p>
                </main>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}