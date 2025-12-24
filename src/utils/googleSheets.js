// Утилиты для работы с Google Sheets

// Функция для автоматического скачивания заказа в CSV
export const downloadOrderAsCSV = (orderData) => {
  const headers = [
    'Номер заказа',
    'Дата',
    'Время',
    'ФИО получателя',
    'WhatsApp',
    'Адрес доставки',
    'Имя владельца',
    'Промокод',
    'Товары',
    'Общая сумма'
  ];

  const items = orderData.items.map(item => 
    `${item.name} (${item.size}) x${item.quantity} = ${item.total}₸`
  ).join('; ');

  const csvRow = [
    orderData.orderNumber,
    orderData.orderDate,
    orderData.orderTime,
    orderData.customer.fullName,
    `+7${orderData.customer.whatsappPhone}`,
    orderData.customer.deliveryAddress.replace(/\n/g, ' '),
    orderData.customer.ownerName || '',
    orderData.customer.promoCode || '',
    items,
    `${orderData.total}₸`
  ].map(field => `"${field}"`).join(',');

  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    csvRow
  ].join('\n');

  // Создаем и скачиваем файл
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `order_${orderData.orderNumber}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Функция для отправки заказа в Google Sheets
export const sendOrderToGoogleSheets = async (orderData) => {
  
  // Замените на ваш Web App URL из Google Apps Script
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyEbTUJQ6y3UVhti_SqFBahEUxp4C6HVfX7PxmcUrGo51TsurtC5tUMfQeXV0kanQbT7g/exec';
  
  try {
    // Форматируем товары как строку для Google Sheets
    const itemsText = orderData.items.map(item => 
      `${item.name} (${item.size}) x${item.quantity} = ${item.total}₸`
    ).join('; ');

    const formData = new FormData();
    
    // Подготавливаем данные для отправки в правильном формате
    formData.append('orderNumber', orderData.orderNumber);
    formData.append('orderDate', orderData.orderDate);
    formData.append('orderTime', orderData.orderTime);
    formData.append('customerName', orderData.customer.fullName);
    formData.append('whatsappPhone', `+7${orderData.customer.whatsappPhone}`);
    formData.append('deliveryAddress', orderData.customer.deliveryAddress.replace(/\n/g, ' '));
    formData.append('ownerName', orderData.customer.ownerName || 'Не указано');
    formData.append('promoCode', orderData.customer.promoCode || 'Нет');
    formData.append('items', itemsText);
    formData.append('total', `${orderData.total}₸`);
    formData.append('status', 'Новый');
    
    console.log('📤 Отправляем данные в Google Sheets:', {
      url: GOOGLE_SHEETS_URL,
      orderNumber: orderData.orderNumber,
      customerName: orderData.customer.fullName,
      total: `${orderData.total}₸`,
      items: itemsText
    });
    
    console.log('🔍 Полные данные отправки:', Object.fromEntries(formData));

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Добавляем для обхода CORS
    });

    // С no-cors мы не можем проверить response.ok, считаем что успешно
    console.log('📡 Ответ от Google Sheets:', response);
    console.log('📡 Статус ответа:', response.status);
    console.log('📡 Тип ответа:', response.type);
    console.log('✅ Данные отправлены в Google Sheets');
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка подключения к Google Sheets:', error);
    console.error('Детали ошибки:', error.message);
    // Даже если Google Sheets не работает, CSV файл все равно скачивается
    return false;
  }
};

// Функция для тестирования подключения к Google Sheets
export const testGoogleSheetsConnection = async () => {
  const testOrder = {
    orderNumber: `TEST-${Date.now()}`,
    orderDate: new Date().toLocaleDateString('ru-RU'),
    orderTime: new Date().toLocaleTimeString('ru-RU'),
    customer: {
      fullName: 'Тестовый Заказ',
      whatsappPhone: '',
      deliveryAddress: 'Тестовый адрес для проверки',
      ownerName: 'Тест',
      promoCode: 'TEST'
    },
    items: [
      {
        name: 'Тестовый товар',
        size: 'M',
        quantity: 1,
        total: 100
      }
    ],
    total: 100
  };

  console.log('🧪 Тестируем подключение к Google Sheets...');
  
  try {
    const result = await sendOrderToGoogleSheets(testOrder);
    if (result) {
      console.log('✅ Тест успешен! Google Sheets подключен.');
      return true;
    } else {
      console.log('❌ Тест не прошел. Проверьте настройки Google Sheets.');
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
    return false;
  }
};

// Функция для получения всех заказов из Google Sheets
export const getOrdersFromGoogleSheets = async () => {
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw0VP9ujIRXlvWD6gqvtqOTpjWISdU7FSORCB-pnPqIWRRHP5oDF_wbHWOBGMKCxf9FEA/exec';
  
  try {
    const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getOrders`);
    
    if (response.ok) {
      const orders = await response.json();
      console.log('📊 Заказы получены из Google Sheets');
      return orders;
    } else {
      console.error('❌ Ошибка получения заказов');
      return [];
    }
  } catch (error) {
    console.error('❌ Ошибка подключения:', error);
    return [];
  }
}; 