import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { AuthResponse } from '../types/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Don't verify token on mount - let API interceptors handle it
        // This prevents double logout issues
      } catch (error) {
        // Clear invalid data
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get guest cart from localStorage
      const guestCartStr = localStorage.getItem('guest_cart');
      let guestCart = [];
      if (guestCartStr) {
        try {
          guestCart = JSON.parse(guestCartStr);
        } catch (error) {
          console.error('Failed to parse guest cart:', error);
        }
      }
      
      console.log('AuthContext: Sending login with guest cart:', guestCart);

      const response = await authAPI.login({ 
        email, 
        password, 
        guest_cart: guestCart 
      });
      const authData: AuthResponse = response.data;
      
      const userData: User = {
        id: authData.user.id,
        email: authData.user.email,
        first_name: authData.user.first_name,
        last_name: authData.user.last_name,
        role: authData.user.role as 'admin' | 'user',
        is_active: authData.user.is_active,
      };
      
      setUser(userData);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Clear guest cart after successful login but with longer delay
      // to ensure cart merge is complete and frontend has loaded merged cart
      setTimeout(() => {
        console.log('AuthContext: Clearing guest cart from localStorage after merge');
        localStorage.removeItem('guest_cart');
      }, 3000); // Increased delay to 3 seconds
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await authAPI.register(userData);
      const authData: AuthResponse = response.data;
      
      const user: User = {
        id: authData.user.id,
        email: authData.user.email,
        first_name: authData.user.first_name,
        last_name: authData.user.last_name,
        role: authData.user.role as 'admin' | 'user',
        is_active: authData.user.is_active,
      };
      
      setUser(user);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
