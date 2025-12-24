import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import { sendOrderToTelegram, sendOrderToEmail } from '../utils/orderExport';
import { sendOrderToGoogleSheets, testGoogleSheetsConnection } from '../utils/googleSheets';
import Footer from '../components/Footer';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappPhone: '',
    deliveryAddress: '',
    ownerName: '',
    promoCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Функция для сохранения заказа и отправки уведомлений
  const saveOrder = async (orderData) => {
    try {
      console.log('📋 Сохраняем заказ:', orderData.orderNumber);
      
      // Сохраняем в localStorage для локального хранения
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Сохраняем заказы за сегодня
      const todayOrders = JSON.parse(localStorage.getItem('todayOrders') || '[]');
      todayOrders.push(orderData);
      localStorage.setItem('todayOrders', JSON.stringify(todayOrders));
      console.log('✅ Заказ сохранен локально');
      
      // Отправляем в Google Sheets и скачиваем CSV
      try {
        await sendOrderToGoogleSheets(orderData);
        console.log('✅ CSV файл скачан, Google Sheets попытка отправки выполнена');
      } catch (sheetsError) {
        console.log('⚠️ Google Sheets недоступен, но CSV файл скачан');
      }
      
      // Отправляем уведомления (раскомментируйте при настройке)
      // await sendOrderToTelegram(orderData);
      // await sendOrderToEmail(orderData);
      
      return true;
    } catch (error) {
      console.error('❌ Ошибка сохранения заказа:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Получаем следующий номер заказа (сбрасываем счетчик каждый день)
    const today = new Date().toDateString();
    const lastOrderDate = localStorage.getItem('lastOrderDate');
    
    let nextOrderNumber = 1;
    if (lastOrderDate === today) {
      const todayOrders = JSON.parse(localStorage.getItem('todayOrders') || '[]');
      nextOrderNumber = todayOrders.length + 1;
    } else {
      localStorage.setItem('lastOrderDate', today);
      localStorage.setItem('todayOrders', '[]');
    }

    // Подготовка данных заказа
    const orderData = {
      orderNumber: `${nextOrderNumber}`,
      orderDate: new Date().toLocaleDateString('ru-RU'),
      orderTime: new Date().toLocaleTimeString('ru-RU'),
      items: cart.map(item => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      total: getCartTotal(),
      customer: {
        fullName: formData.fullName,
        whatsappPhone: formData.whatsappPhone,
        deliveryAddress: formData.deliveryAddress,
        ownerName: formData.ownerName,
        promoCode: formData.promoCode
      }
    };

    // Сохранение заказа
    const saved = await saveOrder(orderData);
    
    if (saved) {
      console.log('🎉 Заказ сохранен, номер заказа:', orderData.orderNumber);
      
      // Сохраняем последний заказ для страницы подтверждения
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      // Очищаем корзину
      clearCart();
      
      // Переходим на страницу подтверждения
      navigate('/confirmation');
    } else {
      alert(t('orderError'));
      setIsSubmitting(false);
    }
  };



  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('emptyCart')}</h2>
          <p className="text-gray-600 mb-8">{t('addItemsToCart')}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            {t('startShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{t('yourOrder')}</h1>
          
          {/* Order - items */}
          <div className="mb-8">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">{t('sizeLabel')}: {item.size}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.quantity}</p>
                    <p className="font-bold">{(item.price * item.quantity).toLocaleString()}₸</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>{t('amount')}:</span>
                <span>{getCartTotal().toLocaleString()}₸</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('recipientFullName')}: <span className="text-red-500">{t('required')}</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('recipientFullNamePlaceholder')}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsappPhone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('whatsappPhoneRequired')}: <span className="text-red-500">{t('required')}</span>
              </label>
              <p className="text-sm text-blue-600 mb-2">
                {t('whatsappImportant')}
              </p>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  +7
                </span>
                <input
                  type="tel"
                  id="whatsappPhone"
                  name="whatsappPhone"
                  required
                  value={formData.whatsappPhone}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(999) 999-99-99"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                {t('deliveryAddressRequired')}: <span className="text-red-500">{t('required')}</span>
              </label>
              <p className="text-sm text-gray-600 mb-2">
                {t('deliveryAddressExample')}
              </p>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                required
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('deliveryAddressPlaceholder')}
              />
              <p className="text-sm text-gray-500 mt-2">
                {t('deliveryNote')}
              </p>
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('ownerNameLabel')}:
              </label>
              <p className="text-sm text-gray-600 mb-2">
                {t('ownerNameDescription')}
              </p>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('ownerNamePlaceholder')}
              />
            </div>

            {/* Promo Code */}
            <div>
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
                {t('promoCodeLabel')}:
              </label>
              <p className="text-sm text-gray-600 mb-2">
                {t('promoCodeDescription')}
              </p>
              <input
                type="text"
                id="promoCode"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('promoCodePlaceholder')}
              />
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>{t('amount')}:</span>
                <span>{getCartTotal().toLocaleString()}₸</span>
              </div>
            </div>

            {/* Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('processingOrder')}
                </div>
              ) : (
                t('orderButton')
              )}
            </button>
          </form>
        </div>
      </div>
      
      
      <Footer />
    </div>
  );
};

export default CheckoutPage; 