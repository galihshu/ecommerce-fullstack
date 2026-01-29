import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product, CartContextType, Cart } from '../types';

type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_CART':
      return { 
        ...state, 
        loading: false, 
        items: action.payload.cart_items || [] 
      };
    
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product?.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product?.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { 
          id: Date.now(), // temporary ID
          product, 
          quantity,
          cart_id: 0,
          product_id: product.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]
      };
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.product?.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product?.id !== productId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.product?.id === productId
            ? { ...item, quantity }
            : item
        )
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize cart with empty state
  useEffect(() => {
    dispatch({ type: 'SET_CART', payload: {
      id: 0,
      user_id: 0,
      is_active: false,
      created_at: '',
      updated_at: '',
      cart_items: []
    } as Cart });
  }, []);

  const addToCart = async (product: Product, quantity: number = 1) => {
    // Add to local state for all users
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = async (productId: number) => {
    // Remove from local state
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    // Update in local state
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = async () => {
    // Clear local state
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total: number, item: CartItem) => {
      return total + ((item.product?.price || 0) * item.quantity);
    }, 0);
  };

  const value: CartContextType = {
    items: state.items,
    loading: state.loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
