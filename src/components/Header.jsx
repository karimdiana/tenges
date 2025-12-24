import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { useState } from 'react';

const Header = () => {
  const { getCartItemCount } = useCart();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cartItemCount = getCartItemCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Left side - Burger menu */}
          <div className="flex items-center">
            <button
              className="p-2 focus:outline-none"
              onClick={() => setMenuOpen(true)}
              aria-label={t('menu')}
            >
              <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Center - Logo */}
          <Link 
            to="/" 
            className="flex items-center hover:opacity-75 transition-opacity"
          >
            <img
              src="/images/iaxarte.png"
              alt="iaxarte Logo"
              className="h-12 sm:h-16 w-auto object-contain"
            />
          </Link>
          
          {/* Right side - Language switcher and Bag icon */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium uppercase"
                aria-label="Change language"
              >
                {currentLanguage === 'ru' ? 'RU' : 'EN'}
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      changeLanguage('ru');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentLanguage === 'ru' ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    Русский
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      currentLanguage === 'en' ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            
            <Link 
              to="/bag" 
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={t('bag')}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
              
              {/* Cart item count badge */}
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Click outside to close language menu */}
      {langMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setLangMenuOpen(false)}
        />
      )}
      
      {/* Burger Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center">
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label={currentLanguage === 'ru' ? 'Закрыть меню' : 'Close menu'}
          >
            ×
          </button>
          <nav className="flex flex-col space-y-8 text-white text-2xl font-bold">
            <Link to="/faq" className="hover:text-gray-300 transition-colors" onClick={() => setMenuOpen(false)}>{t('faq')}</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors" onClick={() => setMenuOpen(false)}>{t('contact')}</Link>
            <Link to="/size-guide" className="hover:text-gray-300 transition-colors" onClick={() => setMenuOpen(false)}>{t('sizeGuide')}</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 