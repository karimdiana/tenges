import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import BagPage from './pages/BagPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminPage from './pages/AdminPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import RefundPage from './pages/RefundPage';
import SizeGuidePage from './pages/SizeGuidePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AccountPage from './pages/AccountPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out animation
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3200); // Start fade out a bit earlier

    // Remove loading screen completely
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // 3.5 seconds total

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          {isLoading ? (
            <LoadingScreen isVisible={isVisible} />
          ) : (
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/bag" element={<BagPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/refund" element={<RefundPage />} />
                    <Route path="/size-guide" element={<SizeGuidePage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminPage />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
              </div>
            </Router>
          )}
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App; 