import React from 'react';
import { useCart } from '../context/CartContext';
import { Link as RouterLink } from 'react-router-dom';

const CartIcon: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <RouterLink 
      to="/cart" 
      className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
      aria-label="Shopping cart"
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
      </svg>
      
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </RouterLink>
  );
};

export default CartIcon;
