# 🔧 Google Sheets Debug Guide

## ✅ Quick Setup Check

### 1. Test Your Connection
1. Go to `/admin` on your website
2. Click **"🧪 Тест Google Sheets"** button
3. Check your Google Sheet for a test entry

### 2. If Test Fails, Check These:

#### A) Google Apps Script Setup
1. Go to [script.google.com](https://script.google.com)
2. Open your project
3. **Replace ALL code** with the updated version from `google-apps-script.js`
4. **Save** (Ctrl+S)
5. **Deploy** → **New Deployment**
6. Set **Type**: Web App
7. Set **Execute as**: Me
8. Set **Who has access**: Anyone
9. Click **Deploy**
10. **Copy the new URL**

#### B) Update Your Website Code
1. Open `src/utils/googleSheets.js`
2. Replace the URL with your new one:
```javascript
const GOOGLE_SHEETS_URL = 'YOUR_NEW_URL_HERE';
```

#### C) Check Google Sheet
1. Make sure your Google Sheet is **empty** or has the right columns
2. The script will auto-create headers on first order

### 3. Expected Google Sheet Columns:
| Номер заказа | Дата | Время | ФИО получателя | WhatsApp | Адрес доставки | Рахмет лист | Промокод | Товары | Сумма | Статус | Дата создания |

### 4. Test Order Flow:
1. Add product to cart
2. Go to checkout
3. Fill form and submit
4. Check these happen:
   - ✅ CSV file downloads
   - ✅ Order appears in Google Sheet
   - ✅ Console shows "✅ Данные отправлены в Google Sheets"

## 🚨 Common Issues:

### Issue: "Google Sheets подключение не работает"
**Solutions:**
1. **Re-deploy** your Google Apps Script
2. Make sure deployment is set to **"Anyone"** access
3. Check the URL is correct
4. Try creating a **new** Google Sheet

### Issue: "CSV downloads but no Google Sheet entry"
**Solutions:**
1. Check Google Apps Script **execution logs**
2. Make sure the script has **write permissions**
3. Verify the Sheet isn't **protected**

### Issue: "CORS errors in console"
**This is normal** - we use `no-cors` mode to bypass this

## 🧪 Manual Test:
You can manually test by pasting this in browser console on your site:
```javascript
import { testGoogleSheetsConnection } from './src/utils/googleSheets.js';
testGoogleSheetsConnection();
```

## 📞 Still Not Working?
1. **CSV files work** - you'll get order data regardless
2. Check **Google Apps Script logs** for errors
3. Try creating a **completely new** Google Sheet and Script
4. The system works even without Google Sheets! 