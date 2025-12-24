import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { exportOrdersToCSV, viewAllOrders, clearAllOrders } from '../utils/orderExport';
import { testGoogleSheetsConnection } from '../utils/googleSheets';

const AdminPage = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];
      const userEmail = user?.email?.toLowerCase();

      if (!userEmail || !adminEmails.includes(userEmail)) {
        // Redirect non-admin users
        window.location.href = '/';
        return;
      }
    } else if (!loading && !isAuthenticated) {
      // Redirect unauthenticated users
      window.location.href = '/';
      return;
    }
  }, [isAuthenticated, user, loading]);

  // Show loading while checking auth
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const allOrders = viewAllOrders();
    setOrders(allOrders);
  };

  const handleExportCSV = () => {
    exportOrdersToCSV();
  };

  const handleClearOrders = () => {
    clearAllOrders();
    loadOrders();
  };

  const handleTestGoogleSheets = async () => {
    const success = await testGoogleSheetsConnection();
    if (success) {
      alert('✅ Google Sheets подключение работает!\n\nПроверьте вашу таблицу - должна появиться тестовая запись.');
    } else {
      alert('❌ Google Sheets подключение не работает.\n\n1. Проверьте URL в коде\n2. Убедитесь что скрипт развернут\n3. Проверьте права доступа');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Админ панель - Заказы</h1>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              📊 Экспорт в CSV
            </button>
            
            <button
              onClick={loadOrders}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              🔄 Обновить
            </button>
            
            <button
              onClick={handleTestGoogleSheets}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              🧪 Тест Google Sheets
            </button>
            
            <button
              onClick={handleClearOrders}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              🗑️ Очистить все
            </button>
          </div>
          
          <div className="mt-4 text-gray-600">
            Всего заказов: <span className="font-semibold">{orders.length}</span>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Список заказов</h2>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Заказов пока нет</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.map((order, index) => (
                  <div
                    key={order.orderNumber}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                      selectedOrder?.orderNumber === order.orderNumber
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.customer.fullName}</p>
                        <p className="text-sm text-gray-500">{order.orderDate} {order.orderTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{order.total.toLocaleString()}₸</p>
                        <p className="text-sm text-gray-500">{order.items.length} товар(ов)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Детали заказа</h2>
            
            {!selectedOrder ? (
              <p className="text-gray-500 text-center py-8">Выберите заказ для просмотра деталей</p>
            ) : (
              <div className="space-y-4">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Информация о заказе</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Номер:</span> {selectedOrder.orderNumber}</p>
                    <p><span className="font-medium">Дата:</span> {selectedOrder.orderDate} {selectedOrder.orderTime}</p>
                    <p><span className="font-medium">Сумма:</span> {selectedOrder.total.toLocaleString()}₸</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Получатель</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">ФИО:</span> {selectedOrder.customer.fullName}</p>
                    <p><span className="font-medium">WhatsApp:</span> +7{selectedOrder.customer.whatsappPhone}</p>
                    <p><span className="font-medium">Адрес:</span> {selectedOrder.customer.deliveryAddress}</p>
                    {selectedOrder.customer.ownerName && (
                      <p><span className="font-medium">Рахмет лист:</span> {selectedOrder.customer.ownerName}</p>
                    )}
                    {selectedOrder.customer.promoCode && (
                      <p><span className="font-medium">Промокод:</span> {selectedOrder.customer.promoCode}</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Товары</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600">Размер: {item.size} • Количество: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{item.total.toLocaleString()}₸</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const text = `
Заказ: ${selectedOrder.orderNumber}
Дата: ${selectedOrder.orderDate} ${selectedOrder.orderTime}
Клиент: ${selectedOrder.customer.fullName}
WhatsApp: +7${selectedOrder.customer.whatsappPhone}
Адрес: ${selectedOrder.customer.deliveryAddress}
${selectedOrder.customer.ownerName ? `Рахмет лист: ${selectedOrder.customer.ownerName}` : ''}
${selectedOrder.customer.promoCode ? `Промокод: ${selectedOrder.customer.promoCode}` : ''}

Товары:
${selectedOrder.items.map(item => `${item.name} (${item.size}) x${item.quantity} = ${item.total}₸`).join('\n')}

Итого: ${selectedOrder.total.toLocaleString()}₸
                      `.trim();
                      
                      navigator.clipboard.writeText(text);
                      alert('Информация о заказе скопирована в буфер обмена');
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                  >
                    📋 Копировать
                  </button>
                  
                  <button
                    onClick={() => {
                      const whatsappMessage = encodeURIComponent(
                        `Здравствуйте! Ваш заказ ${selectedOrder.orderNumber} на сумму ${selectedOrder.total.toLocaleString()}₸ принят в обработку. Скоро с вами свяжется менеджер для уточнения деталей доставки.`
                      );
                      window.open(`https://wa.me/7${selectedOrder.customer.whatsappPhone}?text=${whatsappMessage}`, '_blank');
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Как настроить автоматическую отправку</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Telegram Bot:</strong></p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Создайте бота через @BotFather</li>
              <li>Получите токен бота</li>
              <li>Добавьте бота в ваш чат и получите Chat ID</li>
              <li>Замените YOUR_BOT_TOKEN и YOUR_CHAT_ID в файле orderExport.js</li>
              <li>Раскомментируйте строку await sendOrderToTelegram(orderData) в CheckoutPage.jsx</li>
            </ol>
            
            <p className="mt-4"><strong>Email через EmailJS:</strong></p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Зарегистрируйтесь на emailjs.com</li>
              <li>Установите: npm install @emailjs/browser</li>
              <li>Создайте email service и template</li>
              <li>Замените YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_PUBLIC_KEY в orderExport.js</li>
              <li>Раскомментируйте код EmailJS в orderExport.js</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 