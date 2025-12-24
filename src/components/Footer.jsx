import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top section with links and brand */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Support column */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('support')}</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <Link to="/faq" className="block hover:text-white transition-colors">
                {t('faq')}
              </Link>
              <Link to="/contact" className="block hover:text-white transition-colors">
                {t('contact')}
              </Link>
            </div>
          </div>
          
          {/* Contact Info column */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('contact')}</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.727L12 10.875l9.637-7.054h.727c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
                <a href="mailto:tengesexual@gmail.com" className="hover:text-white transition-colors">
                  tengesexual@gmail.com
                </a>
              </div>

              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <a 
                  href="https://instagram.com/iaxarte" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @iaxarte
                </a>
              </div>
            </div>
          </div>
          
          {/* Legal column */}
          <div>
            <h3 className="font-bold text-lg mb-4">{currentLanguage === 'ru' ? 'Правовая информация' : 'Legal Information'}</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <Link to="/refund" className="block hover:text-white transition-colors">
                {t('refundAndExchange')}
              </Link>
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer; 