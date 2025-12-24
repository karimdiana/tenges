import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import Footer from '../components/Footer';

const BagPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { t } = useTranslation();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('bagEmpty')}</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('addItemsToStart')}
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold text-lg rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('startShopping')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 py-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t('yourBag')}</h1>
            <p className="text-gray-600 text-lg">
              {cart.length} {cart.length === 1 ? t('item') : t('items')}
            </p>
          </div>

          {/* Cart Items */}
          <div className="px-6 sm:px-8 py-6">
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-6 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-xl bg-gray-200 shadow-sm"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                            <rect width="128" height="128" fill="#f3f4f6"/>
                            <text x="64" y="64" text-anchor="middle" fill="#9ca3af" font-size="12">Фото</text>
                          </svg>
                        `)}`;
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-base mb-3">{t('sizeLabel')}: {item.size}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.price.toLocaleString()} ₸</p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all rounded-l-xl"
                        aria-label={t('decreaseQuantity')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-6 py-3 min-w-[4rem] text-center font-bold text-lg text-gray-900 bg-gray-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all rounded-r-xl"
                        aria-label={t('increaseQuantity')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all"
                      aria-label={t('remove')}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-6 sm:px-8 py-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-semibold">{t('total')}</span>
              <span className="text-3xl font-bold">{getCartTotal().toLocaleString()} ₸</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-xl hover:bg-gray-100 transition-all duration-200 text-center transform hover:scale-105"
              >
                ← {t('continueShopping')}
              </Link>
              <Link
                to="/checkout"
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-center transform hover:scale-105 shadow-lg"
              >
                {t('proceedToCheckout')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BagPage; 