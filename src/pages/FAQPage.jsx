import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';

const FAQPage = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = currentLanguage === 'ru' ? [
    {
      question: "Как сделать заказ?",
      answer: "Выберите понравившийся товар, укажите размер и добавьте в корзину. Затем перейдите в корзину, заполните контактные данные и подтвердите заказ. Мы свяжемся с вами для уточнения деталей доставки."
    },
    {
      question: "Какие размеры и материалы?",
      answer: "Размеры от S до 3XL с прямым OVERSIZE кроем. Все футболки изготовлены из 100% хлопка премиум качества плотностью 275 гр/м² с ребристой горловиной и высококачественной шелкографической печатью."
    },
    {
      question: "Доставка и оплата",
      answer: "По Алматы доставка осуществляется тарифом Яндекса в течение 3 дней (от 1000 KZT). По Казахстану отправляем СДЭКом или КазПочтой от 3-10 дней (от 1000 KZT). Принимаем наличные при получении, карты Visa/MasterCard, Kaspi Gold, Freedom Bank и банковские переводы."
    },
    {
      question: "Возврат и уход",
      answer: "Обмен товара возможен в течение 14 дней с момента получения. Подробная информация о возврате и уходе за товарами доступна на странице возврат и обмен."
    }
  ] : [
    {
      question: "How to place an order?",
      answer: "Choose your favorite item, select the size and add to cart. Then go to cart, fill in contact details and confirm the order. We will contact you to clarify delivery details."
    },
    {
      question: "What sizes and materials?",
      answer: "Sizes from S to 3XL with straight OVERSIZE fit. All t-shirts are made from 100% premium cotton with 275 g/m² density, ribbed collar and high-quality screen printing."
    },
    {
      question: "Delivery and payment",
      answer: "Within Almaty delivery is by Yandex tariff within 3 days (from 1000 KZT). Throughout Kazakhstan we ship via SDEK or KazPost from 3-10 days (from 1000 KZT). We accept cash on delivery, Visa/MasterCard cards, Kaspi Gold, Freedom Bank and bank transfers."
    },
    {
      question: "Returns and care",
      answer: "Item exchange is possible within 14 days of receipt. Detailed information about returns and product care is available on the refund and exchange page."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto w-full">
          {/* Main Title */}
          <div className="text-center mb-20">
            <h1 className="text-7xl md:text-9xl font-extrabold text-gray-900 mb-8 tracking-tight">
              {currentLanguage === 'ru' ? 'ВОПРОСЫ' : 'QUESTIONS'}
            </h1>
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-800 mb-8 tracking-tight">
              {currentLanguage === 'ru' ? 'И ОТВЕТЫ' : 'AND ANSWERS'}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              {currentLanguage === 'ru' ? 'Все, что нужно знать о наших товарах и услугах' : 'Everything you need to know about our products and services'}
            </p>
          </div>

          {/* FAQ Content */}
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-8 text-left bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-3xl transition-all duration-300 flex items-center justify-between group-hover:scale-[1.01]"
                >
                  <span className="font-medium text-xl text-gray-900 pr-6 leading-relaxed">
                    {faq.question}
                  </span>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
                    <svg
                      className={`w-8 h-8 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="mt-4 px-8 py-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
                    <p className="text-gray-700 leading-relaxed text-lg font-light">
                      {(faq.question === "Возврат и уход" || faq.question === "Returns and care") ? (
                        <>
                          {currentLanguage === 'ru' 
                            ? 'Обмен товара возможен в течение 14 дней с момента получения. Подробная информация о возврате и уходе за товарами доступна на '
                            : 'Item exchange is possible within 14 days of receipt. Detailed information about returns and product care is available on '}
                          <Link to="/refund" className="text-blue-600 hover:text-blue-800 underline font-medium">
                            {currentLanguage === 'ru' ? 'странице возврат и обмен' : 'refund and exchange page'}
                          </Link>
                          .
                        </>
                      ) : (
                        faq.answer
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage; 