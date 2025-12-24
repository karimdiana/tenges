import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { products } from '../data/products';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Media slideshow data - easily add more videos/images here
  const slideshowMedia = [
    // {
    //   type: 'video',
    //   src: '/images/frame1.mp4',
    //   alt: 'Brand Video'
    // },
    // {
    //   type: 'image',
    //   src: '/images/cotaque.png',
    //   alt: 'Featured Brand'
    // },
    {
      type: 'image',
      src: '/images/blink_slideshow.png',
      alt: 'Blink Slideshow'
    },
   
    // Add more media here later: { type: 'image', src: '/images/your-new-image.jpg', alt: 'Description' }
  ];

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowMedia.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideshowMedia.length]);

  // Persist category selection in URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam && ['all', 'tshirts', 'hoodies'].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', selectedCategory);
    }
    const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedCategory, location.pathname]);

  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return a.price - b.price;
    }
  });
  
  return (
    <div className="min-h-screen">
      {/* Automatic Slideshow Section */}
      <section className="w-full">
        <div className="w-full aspect-video relative">
          {slideshowMedia[currentSlide].type === 'video' ? (
            <video 
              key={currentSlide}
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop 
              playsInline
            >
              <source src={slideshowMedia[currentSlide].src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={slideshowMedia[currentSlide].src}
              alt={slideshowMedia[currentSlide].alt}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </section>

      {/* Thin Divider */}
      <div className="w-full h-px bg-gray-200"></div>

      {/* Category Navigation */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filters */}
            <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {currentLanguage === 'ru' ? 'Все товары' : 'All Products'}
              </button>
              <button
                onClick={() => setSelectedCategory('tshirts')}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedCategory === 'tshirts' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {currentLanguage === 'ru' ? 'Футболки' : 'T-Shirts'}
              </button>
              <button
                onClick={() => setSelectedCategory('hoodies')}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedCategory === 'hoodies' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {currentLanguage === 'ru' ? 'Худи' : 'Hoodies'}
              </button>

            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{t('sortBy')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="price-low">{t('priceLowHigh')}</option>
                <option value="price-high">{t('priceHighLow')}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="pt-6 pb-20 px-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product, index) => (
            <div key={product.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>



      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage; 