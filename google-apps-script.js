// Google Apps Script код для Google Sheets
// Скопируйте этот код в Google Apps Script (script.google.com)

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Получаем данные из POST запроса
    const params = e.parameter;
    
    // Логируем полученные данные для отладки
    console.log('Получены данные заказа:', params);
  
  // Если это первый заказ, создаем заголовки
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Номер заказа',
      'Дата',
      'Время', 
      'ФИО получателя',
      'WhatsApp',
      'Адрес доставки',
      'Рахмет лист',
      'Промокод',
      'Товары',
      'Сумма',
      'Статус',
      'Дата создания'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Форматируем заголовки
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
  }
  
  // Товары уже отформатированы как строка
  const itemsText = params.items || 'Не указано';
  
  // Подготавливаем данные для новой строки
  const newRow = [
    params.orderNumber,
    params.orderDate,
    params.orderTime,
    params.customerName,
    params.whatsappPhone,
    params.deliveryAddress,
    params.ownerName,
    params.promoCode,
    itemsText,
    `${params.total}₸`,
    params.status || 'Новый',
    new Date().toLocaleString('ru-RU')
  ];
  
  // Добавляем строку в таблицу
  sheet.appendRow(newRow);
  
  // Форматируем новую строку
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(lastRow, 1, 1, newRow.length);
  
  // Чередующиеся цвета строк
  if (lastRow % 2 === 0) {
    range.setBackground('#f8f9fa');
  }
  
  // Автоматически подгоняем ширину колонок
  sheet.autoResizeColumns(1, newRow.length);
  
  console.log('Заказ успешно добавлен в таблицу');
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, message: 'Заказ добавлен'}))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Ошибка при добавлении заказа:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getOrders') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const orders = data.slice(1).map(row => {
      const order = {};
      headers.forEach((header, index) => {
        order[header] = row[index];
      });
      return order;
    });
    
    return ContentService
      .createTextOutput(JSON.stringify(orders))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({error: 'Unknown action'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Функция для создания красивого форматирования таблицы
function formatSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Замораживаем первую строку
  sheet.setFrozenRows(1);
  
  // Автоматическая ширина всех колонок
  sheet.autoResizeColumns(1, sheet.getLastColumn());
  
  // Добавляем фильтры
  const range = sheet.getDataRange();
  range.createFilter();
  
  // Форматируем заголовки
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
} 