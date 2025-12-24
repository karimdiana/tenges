// Утилиты для работы с заказами

// Функция для экспорта заказов в CSV
export const exportOrdersToCSV = () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  if (orders.length === 0) {
    alert('Нет заказов для экспорта');
    return;
  }

  // Создаем CSV заголовки
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

  // Преобразуем заказы в CSV строки
  const csvRows = orders.map(order => {
    const items = order.items.map(item => 
      `${item.name} (${item.size}) x${item.quantity} = ${item.total}₸`
    ).join('; ');

    return [
      order.orderNumber,
      order.orderDate,
      order.orderTime,
      order.customer.fullName,
      `+7${order.customer.whatsappPhone}`,
      order.customer.deliveryAddress.replace(/\n/g, ' '),
      order.customer.ownerName || '',
      order.customer.promoCode || '',
      items,
      `${order.total}₸`
    ].map(field => `"${field}"`).join(',');
  });

  // Объединяем заголовки и данные
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...csvRows
  ].join('\n');

  // Создаем и скачиваем файл
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Функция для отправки заказа в Telegram
export const sendOrderToTelegram = async (orderData) => {
  // Замените на ваш Telegram Bot Token и Chat ID
  const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
  const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

  const message = formatOrderForTelegram(orderData);

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (response.ok) {
      console.log('Заказ отправлен в Telegram');
      return true;
    } else {
      console.error('Ошибка отправки в Telegram');
      return false;
    }
  } catch (error) {
    console.error('Ошибка подключения к Telegram:', error);
    return false;
  }
};

// Функция форматирования заказа для Telegram
const formatOrderForTelegram = (orderData) => {
  const items = orderData.items.map(item => 
    `• ${item.name} (${item.size}) x${item.quantity} = ${item.total.toLocaleString()}₸`
  ).join('\n');

  return `
🛍️ <b>НОВЫЙ ЗАКАЗ</b>

📦 <b>Заказ:</b> ${orderData.orderNumber}
📅 <b>Дата:</b> ${orderData.orderDate} ${orderData.orderTime}

👤 <b>Получатель:</b> ${orderData.customer.fullName}
📱 <b>WhatsApp:</b> +7${orderData.customer.whatsappPhone}
📍 <b>Адрес:</b> ${orderData.customer.deliveryAddress}
${orderData.customer.ownerName ? `🎁 <b>Рахмет лист:</b> ${orderData.customer.ownerName}` : ''}
${orderData.customer.promoCode ? `🎟️ <b>Промокод:</b> ${orderData.customer.promoCode}` : ''}

📋 <b>Товары:</b>
${items}

💰 <b>Общая сумма:</b> ${orderData.total.toLocaleString()}₸
  `.trim();
};

// Функция для отправки заказа на email (используя EmailJS)
export const sendOrderToEmail = async (orderData) => {
  // Для использования EmailJS нужно:
  // 1. Зарегистрироваться на emailjs.com
  // 2. Создать email service и template
  // 3. Установить: npm install @emailjs/browser
  
  try {
    // Раскомментируйте после настройки EmailJS:
    /*
    const emailjs = await import('@emailjs/browser');
    
    const templateParams = {
      to_email: 'your-email@example.com',
      order_number: orderData.orderNumber,
      order_date: `${orderData.orderDate} ${orderData.orderTime}`,
      customer_name: orderData.customer.fullName,
      customer_phone: `+7${orderData.customer.whatsappPhone}`,
      delivery_address: orderData.customer.deliveryAddress,
      owner_name: orderData.customer.ownerName || 'Не указано',
      promo_code: orderData.customer.promoCode || 'Не указано',
      items: orderData.items.map(item => 
        `${item.name} (${item.size}) x${item.quantity} = ${item.total.toLocaleString()}₸`
      ).join('\n'),
      total: `${orderData.total.toLocaleString()}₸`
    };

    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams,
      'YOUR_PUBLIC_KEY'
    );
    */
    
    console.log('Email отправка пока не настроена');
    return true;
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    return false;
  }
};

// Функция для просмотра всех заказов
export const viewAllOrders = () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  console.log('📦 Все заказы:', orders);
  return orders;
};

// Функция для очистки всех заказов
export const clearAllOrders = () => {
  if (confirm('Вы уверены, что хотите удалить все заказы?')) {
    localStorage.removeItem('orders');
    alert('Все заказы удалены');
  }
}; 