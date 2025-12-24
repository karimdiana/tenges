import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const ConfirmationPage = () => {
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('noOrderFound')}</h2>
          <p className="text-gray-600 mb-8">{t('unableToFindOrder')}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            {t('returnToStore')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Success Header */}
          <div className="px-8 py-12 text-center bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('thankYouForOrder')}
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {t('orderSuccessfullyPlaced')}
            </p>
            <div className="mt-6 inline-block bg-white px-8 py-4 rounded-xl shadow-md border-2 border-green-200">
              <p className="text-sm text-gray-600 mb-1">{t('yourOrderNumber')}</p>
              <p className="text-4xl font-bold text-green-600">#{orderData.orderNumber}</p>
              <p className="text-xs text-gray-500 mt-2">{t('saveThisNumber')}</p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('orderInfo')}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('orderNumber')}:</span>
                      <span className="font-medium">{orderData.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('orderDateLabel')}:</span>
                      <span className="font-medium">{orderData.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('amount')}:</span>
                      <span className="font-bold text-lg">{orderData.total.toLocaleString()}₸</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('deliveryInfo')}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('fullNameLabel')}:</span>
                      <span className="font-medium">{orderData.customer.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('whatsappLabel')}:</span>
                      <span className="font-medium">+7{orderData.customer.whatsappPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('addressLabel')}:</span>
                      <span className="font-medium text-right max-w-xs">{orderData.customer.deliveryAddress}</span>
                    </div>
                    {orderData.customer.ownerName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('rakhmetList')}:</span>
                        <span className="font-medium">{orderData.customer.ownerName}</span>
                      </div>
                    )}
                    {orderData.customer.promoCode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('promoCodeLabel2')}:</span>
                        <span className="font-medium">{orderData.customer.promoCode}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('orderDetails')}</h2>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{t('sizeLabel')}: {item.size} • {t('quantityLabel')}: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-gray-900">{(item.total).toLocaleString()}₸</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">{t('totalLabel')}:</span>
                    <span className="text-xl font-bold text-gray-900">{orderData.total.toLocaleString()}₸</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">{t('whatHappensNext')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-800">1</span>
                  </div>
                  <p>{t('reviewOrder')}</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-800">2</span>
                  </div>
                  <p>{t('contactYou')}</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-800">3</span>
                  </div>
                  <p>{t('prepareOrder')}</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-800">4</span>
                  </div>
                  <p>{t('trackingInfo')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors text-center"
              >
                {t('continueShopping')}
              </Link>
              <button
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t('printOrder')}
              </button>
            </div>

            {/* Support Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('needHelpTitle')}</h3>
              <p className="text-gray-600 mb-4">
                {t('needHelpDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <span>{t('supportEmail')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>{t('liveChat')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage; 