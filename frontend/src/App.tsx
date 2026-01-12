import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
// User Components (direct import)
import { Navbar, Footer } from './components/user-components';
// Admin Components  
import { AdminLayout, ProtectedRoute } from './components';
// User Pages (direct import)
import { Homepage, ProductsPage, ProductDetail, CartPage, LoginPage, RegisterPage } from './pages/user-pages';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
// Admin Pages
import { AdminLoginPage, AdminDashboard, AdminProducts, AdminOrders, AdminUsers, AdminAnalytics, AdminSettings } from './pages/admin';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* User Routes - with Navbar and Footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
            
            {/* Admin Login - standalone page */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Admin Routes - with AdminLayout */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
