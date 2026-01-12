import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemComponentProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemComponentProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else if (newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <RouterLink
                to={`/product/${product.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {product.name}
              </RouterLink>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <button
              onClick={() => removeFromCart(product.id)}
              className="text-red-500 hover:text-red-700 transition-colors p-1"
              aria-label="Remove item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    handleQuantityChange(newQuantity);
                  }}
                  className="w-16 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500">
                (Max: {product.stock})
              </span>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Price per item:</p>
              <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
            </div>
          </div>

          {/* Total Price */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
