import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product, CartContextType, Cart } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

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
      console.log('SET_CART action payload:', action.payload);
      console.log('SET_CART cart_items:', action.payload.cart_items);
      console.log('SET_CART items to be set:', action.payload.cart_items || []);
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
  const { isAuthenticated } = useAuth();

  // Load cart from API on mount if user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          
          // Add delay to ensure guest cart merge is complete on backend
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const response = await cartAPI.getCart();
          console.log('Cart API response after login:', response.data);
          console.log('Cart API response structure:', JSON.stringify(response.data, null, 2));
          console.log('Cart items from API:', response.data.cart_items);
          console.log('Cart items type:', typeof response.data.cart_items);
          console.log('Cart items isArray:', Array.isArray(response.data.cart_items));
          dispatch({ type: 'SET_CART', payload: response.data });
          
          // Verify cart merge was successful
          if (response.data.cart_items && response.data.cart_items.length > 0) {
            console.log('✅ Cart merge successful - items loaded from database');
          } else {
            console.log('ℹ️ Cart is empty after login - guest cart might have been empty or merge failed');
          }
        } catch (error) {
          console.error('Failed to load cart after login:', error);
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        // Load guest cart from localStorage for unauthenticated users
        await loadGuestCartFromLocalStorage();
      }
    };

    loadCart();
  }, [isAuthenticated]); // Trigger when authentication state changes

  const addToCart = async (product: Product, quantity: number = 1) => {
    // Add to local state first for immediate UI update
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    
    if (isAuthenticated) {
      // For authenticated users, save to backend database
      try {
        console.log('CartContext: Adding item to backend cart', { product_id: product.id, quantity });
        const response = await cartAPI.addToCart({
          product_id: product.id,
          quantity: quantity
        });
        console.log('CartContext: Backend add to cart response:', response.data);
        
        // Refresh cart from backend to get the latest state
        await refreshCart();
      } catch (error) {
        console.error('CartContext: Failed to add item to backend cart:', error);
        // Revert local state on error
        dispatch({ type: 'REMOVE_FROM_CART', payload: product.id });
      }
    } else {
      // For guest users, save to localStorage
      saveGuestCartToLocalStorage();
    }
  };

  const removeFromCart = async (productId: number) => {
    // Remove from local state first for immediate UI update
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    
    if (isAuthenticated) {
      // For authenticated users, remove from backend database
      try {
        console.log('CartContext: Removing item from backend cart', { product_id: productId });
        
        // Find the cart item ID for this product
        const cartItem = state.items.find(item => item.product?.id === productId);
        if (cartItem && cartItem.id) {
          await cartAPI.removeFromCart(cartItem.id);
          console.log('CartContext: Item removed from backend cart');
          
          // Refresh cart from backend to get the latest state
          await refreshCart();
        }
      } catch (error) {
        console.error('CartContext: Failed to remove item from backend cart:', error);
        // Revert local state on error - we'd need to re-add the item
        // For now, just refresh to get the correct state
        await refreshCart();
      }
    } else {
      // For guest users, save to localStorage
      saveGuestCartToLocalStorage();
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    // Update in local state first for immediate UI update
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    
    if (isAuthenticated) {
      // For authenticated users, update in backend database
      try {
        console.log('CartContext: Updating item quantity in backend cart', { product_id: productId, quantity });
        
        // Find the cart item ID for this product
        const cartItem = state.items.find(item => item.product?.id === productId);
        if (cartItem && cartItem.id) {
          await cartAPI.updateCartItem(cartItem.id, { quantity });
          console.log('CartContext: Item quantity updated in backend cart');
          
          // Refresh cart from backend to get the latest state
          await refreshCart();
        }
      } catch (error) {
        console.error('CartContext: Failed to update item quantity in backend cart:', error);
        // Revert local state on error
        await refreshCart();
      }
    } else {
      // For guest users, save to localStorage
      saveGuestCartToLocalStorage();
    }
  };

  const clearCart = async () => {
    // Clear local state
    dispatch({ type: 'CLEAR_CART' });
    
    // Clear localStorage for guest users
    if (!isAuthenticated) {
      localStorage.removeItem('guest_cart');
    } else {
      // For authenticated users, also clear cart on backend
      try {
        await cartAPI.clearCart();
      } catch (error) {
        console.error('Failed to clear cart on backend:', error);
      }
    }
  };

  const refreshCart = async () => {
    if (isAuthenticated) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await cartAPI.getCart();
        dispatch({ type: 'SET_CART', payload: response.data });
      } catch (error) {
        console.error('Failed to refresh cart:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  // Helper function to save guest cart to localStorage
  const saveGuestCartToLocalStorage = () => {
    const cartData = state.items.map(item => ({
      product_id: item.product?.id,
      quantity: item.quantity,
    }));
    console.log('Saving guest cart to localStorage:', cartData);
    localStorage.setItem('guest_cart', JSON.stringify(cartData));
  };

  // Helper function to load guest cart from localStorage
  const loadGuestCartFromLocalStorage = async () => {
    const guestCartStr = localStorage.getItem('guest_cart');
    console.log('Loading guest cart from localStorage:', guestCartStr);
    
    if (guestCartStr) {
      try {
        const guestCart = JSON.parse(guestCartStr);
        console.log('Parsed guest cart:', guestCart);
        
        // Load product data for each guest cart item
        const cartItems: CartItem[] = [];
        
        for (let i = 0; i < guestCart.length; i++) {
          const item = guestCart[i];
          
          try {
            // Fetch product data
            const response = await fetch(`http://localhost:8080/api/v1/products/${item.product_id}`);
            if (response.ok) {
              const productData = await response.json();
              
              cartItems.push({
                id: Date.now() + i, // temporary ID
                cart_id: 0,
                product_id: item.product_id,
                quantity: item.quantity,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                product: productData.data // Include full product data
              });
            } else {
              console.warn(`Failed to load product ${item.product_id}`);
            }
          } catch (error) {
            console.error(`Error loading product ${item.product_id}:`, error);
          }
        }
        
        console.log('Converted cart items with products:', cartItems);
        
        dispatch({ type: 'SET_CART', payload: {
          id: 0,
          user_id: 0,
          is_active: false,
          created_at: '',
          updated_at: '',
          cart_items: cartItems
        } as Cart });
      } catch (error) {
        console.error('Failed to load guest cart:', error);
      }
    }
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
    refreshCart,
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
