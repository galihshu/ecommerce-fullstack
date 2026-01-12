import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    
    // Show feedback
    const button = e.currentTarget as HTMLButtonElement;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.classList.add('bg-green-500', 'hover:bg-green-600');
    button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-500', 'hover:bg-green-600');
      button.classList.add('bg-blue-500', 'hover:bg-blue-600');
    }, 1500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getFallbackImage = (productName: string) => {
    // Generate a deterministic color based on product name
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-gray-500'
    ];
    const colorIndex = productName.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  return (
    <RouterLink
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 relative">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className={`h-48 w-full ${getFallbackImage(product.name)} flex items-center justify-center`}>
            <div className="text-white text-center p-4">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-medium truncate">{product.name}</p>
            </div>
          </div>
        )}
        {!imageLoaded && !imageError && product.image && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
            {product.category?.name || 'Uncategorized'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-gray-500">
              Stock: {product.stock} units
            </p>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm whitespace-nowrap ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-sm hover:shadow-md'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </RouterLink>
  );
};

export default ProductCard;
