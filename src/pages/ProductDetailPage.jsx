import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import Footer from '../components/Footer';
import { products } from '../data/products';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showCareInstructions, setShowCareInstructions] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  // Get product content (only Russian)
  const getLocalizedContent = (content) => {
    return content;
  };

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  const handleAddToBag = async () => {
    setIsAdding(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addToCart({
      id: product.id,
      name: getLocalizedContent(product.name),
      price: product.price,
      image: product.image,
      size: selectedSize
    });
    
    setIsAdding(false);
  };

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Get related products (exclude current product)
  const relatedProducts = products.filter(p => p.id !== parseInt(id)).slice(0, 6);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('productNotFound')}</h2>
          <p className="text-gray-600 mb-8">{t('productNotFoundDesc')}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            {t('backToStore')}
          </Link>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden group">
              <img
                src={product.images[selectedImageIndex]}
                alt={getLocalizedContent(product.name)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <rect width="400" height="400" fill="#fafafa"/>
                      <text x="200" y="200" text-anchor="middle" fill="#a3a3a3" font-size="16" font-family="system-ui">Изображение недоступно</text>
                    </svg>
                  `)}`;
                }}
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-neutral-900 p-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-105 opacity-0 group-hover:opacity-100"
                    aria-label="Предыдущее изображение"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-neutral-900 p-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-105 opacity-0 group-hover:opacity-100"
                    aria-label="Следующее изображение"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image indicator dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        selectedImageIndex === index ? 'bg-neutral-900 w-6' : 'bg-neutral-400'
                      }`}
                      aria-label={`Изображение ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 overflow-hidden border transition-all ${
                      selectedImageIndex === index 
                        ? 'border-neutral-900 border-2' 
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col space-y-8">
            {/* Title and Price */}
            <div className="space-y-2 border-b border-neutral-200 pb-6">
              <h1 className="text-3xl lg:text-4xl font-medium tracking-tight text-neutral-900">
                {getLocalizedContent(product.name)}
              </h1>
              <p className="text-2xl font-light text-neutral-700">
                {product.price.toLocaleString()} ₸
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-500">{t('details')}</h3>
              <ul className="space-y-2.5">
                {getLocalizedContent(product.features).map((feature, index) => (
                  <li key={index} className="text-sm text-neutral-700 leading-relaxed">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-500">{t('sizeSelection')}</h3>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 px-3 text-center text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-50 text-neutral-900 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToBag}
              disabled={isAdding}
              className="w-full bg-neutral-900 text-white py-4 px-6 text-sm font-medium uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('adding')}
                </span>
              ) : (
                t('addToCart')
              )}
            </button>

            {/* Dropdown Sections */}
            <div className="space-y-2 border-t border-neutral-200 pt-6">
              {/* Care Instructions */}
              <div className="border-b border-neutral-100">
                <button
                  onClick={() => setShowCareInstructions(!showCareInstructions)}
                  className="w-full py-4 text-left flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-neutral-900">{t('careInstructions')}</span>
                  <svg
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                      showCareInstructions ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCareInstructions && (
                  <div className="pb-4">
                    <ul className="space-y-2">
                      {getLocalizedContent(product.careInstructions).map((instruction, index) => (
                        <li key={index} className="text-sm text-neutral-600 leading-relaxed">
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Size Guide */}
              <div>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="w-full py-4 text-left flex items-center justify-between group"
                >
                  <span className="text-sm font-medium text-neutral-900">{t('sizeChart')}</span>
                  <svg
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                      showSizeGuide ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSizeGuide && (
                  <div className="pb-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="text-left py-3 font-medium text-neutral-900">Размер</th>
                            <th className="text-center py-3 font-medium text-neutral-900">Длина</th>
                            <th className="text-center py-3 font-medium text-neutral-900">Ширина</th>
                            <th className="text-center py-3 font-medium text-neutral-900">Рукав</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(getLocalizedContent(product.sizeGuide)).map(([size, measurements]) => (
                            <tr key={size} className="border-b border-neutral-100">
                              <td className="py-3 font-medium text-neutral-900">{size}</td>
                              <td className="text-center py-3 text-neutral-600">{measurements.length}</td>
                              <td className="text-center py-3 text-neutral-600">{measurements.width}</td>
                              <td className="text-center py-3 text-neutral-600">{measurements.sleeve}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-neutral-500 mt-4">
                      {t('measurementsApproximate')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section - Continuous Slideshow */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 py-16 border-t border-neutral-200">
            <div className="px-4">
              <h2 className="text-xl font-medium text-neutral-900 text-center mb-10 tracking-tight">
                {t('youMayAlsoLike')}
              </h2>
              
              {/* Continuous Scrolling Container */}
              <div className="relative overflow-hidden">
                <div className="flex animate-scroll">
                  {/* First set of products */}
                  {relatedProducts.map((product, index) => (
                    <div key={`first-${product.id}`} className="flex-shrink-0 w-64 mx-3">
                      <Link to={`/product/${product.id}`} className="block hover-lift">
                        <div>
                          {/* Product Image */}
                          <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: '#e5e5e5' }}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMzMuMzMzIDIwMEMyMjQuNDkzIDIwMCAyMTcuMzMzIDIwNy4xNiAyMTcuMzMzIDIxNkMyMTcuMzMzIDIyNC44NCAyMjQuNDkzIDIzMiAyMzMuMzMzIDIzMkMyNDIuMTczIDIzMiAyNDkuMzMzIDIyNC44NCAyNDkuMzMzIDIxNkMyNDkuMzMzIDIwNy4xNiAyNDIuMTczIDIwMCAyMzMuMzMzIDIwMFoiIGZpbGw9IiM5Q0E0QjUiLz4KPHBhdGggZD0iTTE2MS4zMzMgMjY2LjY2N0gzMzguNjY3QzM0Ny41MDcgMjY2LjY2NyAzNTQuNjY3IDI1OS41MDcgMzU0LjY2NyAyNTAuNjY3VjE3NS4zMzNDMzU0LjY2NyAxNjYuNDkzIDM0Ny41MDcgMTU5LjMzMyAzMzguNjY3IDE5OS4zMzNIMTYxLjMzM0MxNTIuNDkzIDE1OS4zMzMgMTQ1LjMzMyAxNjYuNDkzIDE0NS4zMzMgMTc1LjMzM1YyNTAuNjY3QzE0NS4zMzMgMjU5LjUwNyAxNTIuNDkzIDI2Ni42NjcgMTYxLjMzMyAyNjYuNjY3WiIgZmlsbD0iIzlDQTRCNSIvPgo8L3N2Zz4K';
                              }}
                            />
                          </div>
                          {/* Product Info */}
                          <div className="pt-3">
                            <h3 className="font-medium text-xs text-neutral-900 mb-1 text-left tracking-tight">
                              {product.name}
                            </h3>
                            <p className="text-xs text-neutral-600 text-left">
                              {product.price.toLocaleString()} ₸
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {relatedProducts.map((product, index) => (
                    <div key={`second-${product.id}`} className="flex-shrink-0 w-64 mx-3">
                      <Link to={`/product/${product.id}`} className="block hover-lift">
                        <div>
                          {/* Product Image */}
                          <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: '#e5e5e5' }}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMzMuMzMzIDIwMEMyMjQuNDkzIDIwMCAyMTcuMzMzIDIwNy4xNiAyMTcuMzMzIDIxNkMyMTcuMzMzIDIyNC44NCAyMjQuNDkzIDIzMiAyMzMuMzMzIDIzMkMyNDIuMTczIDIzMiAyNDkuMzMzIDIyNC44NCAyNDkuMzMzIDIxNkMyNDkuMzMzIDIwNy4xNiAyNDIuMTczIDIwMCAyMzMuMzMzIDIwMFoiIGZpbGw9IiM5Q0E0QjUiLz4KPHBhdGggZD0iTTE2MS4zMzMgMjY2LjY2N0gzMzguNjY3QzM0Ny41MDcgMjY2LjY2NyAzNTQuNjY3IDI1OS41MDcgMzU0LjY2NyAyNTAuNjY3VjE3NS4zMzNDMzU0LjY2NyAxNjYuNDkzIDM0Ny41MDcgMTU5LjMzMyAzMzguNjY3IDE5OS4zMzNIMTYxLjMzM0MxNTIuNDkzIDE1OS4zMzMgMTQ1LjMzMyAxNjYuNDkzIDE0NS4zMzMgMTc1LjMzM1YyNTAuNjY3QzE0NS4zMzMgMjU5LjUwNyAxNTIuNDkzIDI2Ni42NjcgMTYxLjMzMyAyNjYuNjY3WiIgZmlsbD0iIzlDQTRCNSIvPgo8L3N2Zz4K';
                              }}
                            />
                          </div>
                          {/* Product Info */}
                          <div className="pt-3">
                            <h3 className="font-medium text-xs text-neutral-900 mb-1 text-left tracking-tight">
                              {product.name}
                            </h3>
                            <p className="text-xs text-neutral-600 text-left">
                              {product.price.toLocaleString()} ₸
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage; 