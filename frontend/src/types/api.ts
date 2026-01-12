export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image: string;
  images?: string[];
  sku?: string;
  weight?: number;
  dimensions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  reviews?: Review[];
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
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

export interface Cart {
  id: number;
  user_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  cart_items?: CartItem[];
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
  user?: User;
  order_items?: OrderItem[];
}

export interface Address {
  id: number;
  user_id: number;
  type: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
