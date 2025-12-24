import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  
  // Get product content (Russian only)
  const productName = product.name;

  const handleAddToBag = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addToCart({
      id: product.id,
      name: productName,
      price: product.price,
      image: product.image,
      size: selectedSize
    });
    
    setIsAdding(false);
  };

  return (
    <Link to={`/product/${product.id}`} className="block hover-lift">
      <div>
        {/* Product Image - Square, No Frame */}
        <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: '#e5e5e5' }}>
          <img
            src={product.image}
            alt={productName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMzMuMzMzIDIwMEMyMjQuNDkzIDIwMCAyMTcuMzMzIDIwNy4xNiAyMTcuMzMzIDIxNkMyMTcuMzMzIDIyNC44NCAyMjQuNDkzIDIzMiAyMzMuMzMzIDIzMkMyNDIuMTczIDIzMiAyNDkuMzMzIDIyNC44NCAyNDkuMzMzIDIxNkMyNDkuMzMzIDIwNy4xNiAyNDIuMTczIDIwMCAyMzMuMzMzIDIwMFoiIGZpbGw9IiM5Q0E0QjUiLz4KPHBhdGggZD0iTTE2MS4zMzMgMjY2LjY2N0gzMzguNjY3QzM0Ny41MDcgMjY2LjY2NyAzNTQuNjY3IDI1OS41MDcgMzU0LjY2NyAyNTAuNjY3VjE3NS4zMzNDMzU0LjY2NyAxNjYuNDkzIDM0Ny41MDcgMTU5LjMzMyAzMzguNjY3IDE5OS4zMzNIMTYxLjMzM0MxNTIuNDkzIDE1OS4zMzMgMTQ1LjMzMyAxNjYuNDkzIDE0NS4zMzMgMTc1LjMzM1YyNTAuNjY3QzE0NS4zMzMgMjU5LjUwNyAxNTIuNDkzIDI2Ni42NjcgMTYxLjMzMyAyNjYuNjY3WiIgZmlsbD0iIzlDQTRCNSIvPgo8L3N2Zz4K';
            }}
          />
        </div>
        {/* Product Info - Small, Tight */}
        <div className="pt-3">
          <h3 className="font-bold uppercase text-xs text-gray-900 mb-1 text-left">
            {productName}
          </h3>
          <p className="text-sm text-gray-900 text-left mb-2">
            {product.price} KZT
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 