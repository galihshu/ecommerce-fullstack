import React from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  showStock?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  quantity = 1, 
  className = "",
  showStock = true
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (product.stock < quantity) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    try {
      await addToCart(product, quantity);
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
      successMessage.textContent = `${product.name} added to cart!`;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
    } catch (error) {
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const isOutOfStock = product.stock === 0;
  const hasLowStock = product.stock > 0 && product.stock < 5;

  return (
    <div className="space-y-2">
      {showStock && (
        <div className="text-sm">
          {isOutOfStock ? (
            <span className="text-red-600 font-medium">Out of Stock</span>
          ) : hasLowStock ? (
            <span className="text-yellow-600 font-medium">
              Only {product.stock} left in stock!
            </span>
          ) : (
            <span className="text-green-600 font-medium">In Stock</span>
          )}
        </div>
      )}
      
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg'
        } ${className}`}
      >
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default AddToCartButton;
