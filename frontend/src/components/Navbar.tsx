import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Cart', path: '/cart' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <RouterLink to="/" className="text-2xl font-bold text-blue-600">
              E-Commerce
            </RouterLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <RouterLink
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-blue-500 font-medium transition-colors"
              >
                {item.name}
              </RouterLink>
            ))}
            
            {/* Authentication Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <RouterLink
                      to="/admin/dashboard"
                      className="text-gray-600 hover:text-blue-500 font-medium transition-colors"
                    >
                      Admin
                    </RouterLink>
                  )}
                  <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <RouterLink
                  to="/login"
                  className="text-gray-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Login
                </RouterLink>
              )}
            </div>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center">
            <RouterLink to="/cart" className="relative p-2">
              <svg
                className="w-6 h-6 text-gray-600 hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </RouterLink>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-2 p-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <RouterLink
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 text-gray-600 hover:text-blue-500 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </RouterLink>
              ))}
              
              {/* Mobile Authentication Section */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <RouterLink
                        to="/admin/dashboard"
                        className="block px-3 py-2 text-gray-600 hover:text-blue-500 font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </RouterLink>
                    )}
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Hi, {user?.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-500 font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <RouterLink
                    to="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-500 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </RouterLink>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
