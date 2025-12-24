import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { products } from '../data/products';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';

const SizeGuidePage = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  // Get size guide from first product (all products have same size guide)
  const sizeGuide = products[0]?.sizeGuide || {};

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
            {t('sizeGuideTitle')}
          </h1>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            {t('chooseRightSize')}
          </p>
        </div>

        {/* Size Chart Image */}
        <div className="mb-12">
          <div className="bg-neutral-50 p-8 rounded-lg">
            <img
              src="/images/sizechart.png"
              alt="Таблица размеров"
              className="w-full h-auto max-w-2xl mx-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Size Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6 text-center">
            {t('sizesInCentimeters')}
          </h2>
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-200">
                            <th className="text-left py-4 px-6 font-medium text-neutral-900">{t('sizeLabel')}</th>
                            <th className="text-center py-4 px-6 font-medium text-neutral-900">{currentLanguage === 'ru' ? 'Длина' : 'Length'}</th>
                            <th className="text-center py-4 px-6 font-medium text-neutral-900">{currentLanguage === 'ru' ? 'Ширина' : 'Width'}</th>
                            <th className="text-center py-4 px-6 font-medium text-neutral-900">{currentLanguage === 'ru' ? 'Рукав' : 'Sleeve'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(sizeGuide).map(([size, measurements], index) => (
                            <tr 
                              key={size} 
                              className={`border-b border-neutral-100 ${
                                index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
                              }`}
                            >
                              <td className="py-4 px-6 font-medium text-neutral-900">{size}</td>
                              <td className="text-center py-4 px-6 text-neutral-700">{measurements.length} {t('cm')}</td>
                              <td className="text-center py-4 px-6 text-neutral-700">{measurements.width} {t('cm')}</td>
                              <td className="text-center py-4 px-6 text-neutral-700">{measurements.sleeve} {t('cm')}</td>
                            </tr>
                          ))}
                        </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* How to Measure Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-neutral-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              {t('howToMeasureLength')}
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('measureLengthDescription')}
            </p>
          </div>
          <div className="bg-neutral-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              {t('howToMeasureWidth')}
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('measureWidthDescription')}
            </p>
          </div>
          <div className="bg-neutral-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              {t('howToMeasureSleeve')}
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('measureSleeveDescription')}
            </p>
          </div>
          <div className="bg-neutral-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              {t('important')}
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {t('measurementsNote')}
            </p>
          </div>
        </div>

        {/* Size Tips */}
        <div className="bg-neutral-900 text-white p-8 rounded-lg mb-12">
          <h3 className="text-xl font-medium mb-4">{t('sizeSelectionTips')}</h3>
          <ul className="space-y-3 text-neutral-300">
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span>{t('oversizeFit')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span>{t('betweenSizes')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">•</span>
              <span>{t('cottonShrinkage')}</span>
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SizeGuidePage;

