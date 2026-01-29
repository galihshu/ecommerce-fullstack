export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  stock: number;
  category_id: number;
  category?: {
    id: number;
    name: string;
    description: string;
    image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  sku?: string;
  weight?: number;
  dimensions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  reviews?: {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
    user?: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  }[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  cart_items?: CartItem[];
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  shipping_address: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}
