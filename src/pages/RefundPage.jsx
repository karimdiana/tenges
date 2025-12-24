import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';

const RefundPage = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{t('refundAndExchange')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {currentLanguage === 'ru' ? 'Условия возврата и обмена товаров' : 'Refund and exchange conditions'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg slide-in-left">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('refundPolicy')}</h2>
            
            <div className="space-y-6 text-gray-700">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="font-semibold text-blue-900 mb-2">⚠️ {t('important')}</p>
                <p className="text-blue-800">
                  {t('refundOnlySize')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('refundConditions')}</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>{t('itemMustBeOriginal')}</li>
                  <li>{t('noWearSigns')}</li>
                  <li>{t('withTags')}</li>
                  <li>{t('within14Days')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('notRefundable')}</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>{t('usedItems')}</li>
                  <li>{t('damagedItems')}</li>
                  <li>{t('noOriginalPackaging')}</li>
                  <li>{t('didntLike')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('refundProcess')}</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>{t('contactWhatsApp')}</li>
                  <li>{t('provideOrderNumber')}</li>
                  <li>{t('sendPhotos')}</li>
                  <li>{t('confirmRefund')}</li>
                  <li>{t('sendItemBack')}</li>
                </ol>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('contactUsRefund')}</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>{t('instagramLabel')}</strong> @iaxarte</p>
                  <p><strong>{t('emailLabel')}</strong> tengesexual@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefundPage; 