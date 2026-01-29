import React, { useState } from 'react';
import CartItem from '../components/CartItem';
import AddToCartButton from '../components/AddToCartButton';
import { useCart } from '../context/CartContext';

// Sample products untuk demo
const sampleProducts = [
  {
    id: 1,
    name: "Laptop Gaming ROG",
    price: 15000000,
    description: "Laptop gaming high performance",
    image: "https://via.placeholder.com/150x150?text=Laptop",
    stock: 5,
    category_id: 1,
    category: { id: 1, name: "Electronics", description: "Electronic items", is_active: true, created_at: "", updated_at: "" },
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    name: "Mouse Gaming RGB",
    price: 500000,
    description: "Mouse gaming dengan RGB",
    image: "https://via.placeholder.com/150x150?text=Mouse",
    stock: 10,
    category_id: 1,
    category: { id: 1, name: "Electronics", description: "Electronic items", is_active: true, created_at: "", updated_at: "" },
    is_active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 1200000,
    description: "Keyboard mechanical blue switch",
    image: "https://via.placeholder.com/150x150?text=Keyboard",
    stock: 3,
    category_id: 1,
    category: { id: 1, name: "Electronics", description: "Electronic items", is_active: true, created_at: "", updated_at: "" },
    is_active: true,
    created_at: "",
    updated_at: ""
  }
];

const DemoCartPage: React.FC = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [showProducts, setShowProducts] = useState(true);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart Demo</h1>
          <p className="text-gray-600">
            Demo halaman keranjang belanja dengan fitur lengkap
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {showProducts ? 'Sembunyikan Produk' : 'Tampilkan Produk'}
          </button>
        </div>

        {/* Sample Products */}
        {showProducts && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <AddToCartButton product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some products from above to see them in your cart!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              
              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => setShowProducts(true)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 px-6 py-3 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="promo"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Proceed to Checkout
                </button>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoCartPage;
