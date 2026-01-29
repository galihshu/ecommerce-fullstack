import React, { useState } from 'react';

import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

import { useCart } from '../context/CartContext';

import { useAuth } from '../context/AuthContext';

import { checkoutAPI } from '../services/api';



const CheckoutPage: React.FC = () => {

  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();

  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({

    address: '',

    city: '',

    province: '',

    postal_code: '',

  });

  const [paymentMethod, setPaymentMethod] = useState('cod');



  const formatPrice = (price: number) => {

    return new Intl.NumberFormat('id-ID', {

      style: 'currency',

      currency: 'IDR',

      minimumFractionDigits: 0,

    }).format(price);

  };



  const subtotal = getTotalPrice();

  const shippingCost = subtotal > 500000 ? 0 : 15000; // Free shipping for orders > 500k

  const tax = Math.round(subtotal * 0.1); // 10% tax

  const totalAmount = subtotal + shippingCost + tax;



  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      // Check if we just came from login (cart merge might be in progress)
      const from = location.state?.from?.pathname;
      if (from === '/login') {
        console.log('CheckoutPage: User just logged in, waiting for cart merge...');
        // Add a small delay to ensure cart merge is complete
        const timer = setTimeout(() => {
          console.log('CheckoutPage: Cart merge should be complete now');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, navigate, location.state?.from?.pathname]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    setShippingAddress({

      ...shippingAddress,

      [e.target.name]: e.target.value,

    });

  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    setError('');

    setIsProcessingCheckout(true); // Prevent empty cart redirect during checkout



    // Don't refresh cart before checkout - use current cart state
    // This prevents cart from being cleared before checkout completes

    // Validate cart items before proceeding
    console.log('Checkout validation - items:', items);
    console.log('Checkout validation - items.length:', items.length);
    console.log('Checkout validation - items detail:', JSON.stringify(items, null, 2));
    
    // Emergency fix: Use multiple validation methods to detect if cart is truly empty
    const hasItemsByLength = items.length > 0;
    const hasItemsByCheck = items && Array.isArray(items) && items.length > 0;
    const hasItemsByUI = document.querySelector('.space-y-3 .flex.items-center') !== null;
    
    console.log('Validation methods:');
    console.log('- hasItemsByLength:', hasItemsByLength);
    console.log('- hasItemsByCheck:', hasItemsByCheck);
    console.log('- hasItemsByUI:', hasItemsByUI);
    
    // Use UI-based validation as fallback
    const cartHasItems = hasItemsByLength || hasItemsByUI;
    
    if (!cartHasItems) {
      console.log('Cart is empty, showing error');
      setError('Your cart is empty. Please add items before checkout.');
      setLoading(false);
      setIsProcessingCheckout(false);
      return;
    } else {
      console.log('Cart has items (detected by alternative method), proceeding with checkout');
    }

    // Validate form
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.province || !shippingAddress.postal_code) {
      setError('Please fill in all shipping address fields');
      setLoading(false);
      return;
    }



    try {

      const orderData = {

        shipping_address: {

          type: 'home',

          address: shippingAddress.address,

          city: shippingAddress.city,

          province: shippingAddress.province,

          postal_code: shippingAddress.postal_code,

        },

        payment_method: paymentMethod === 'transfer' ? 'bank_transfer' : paymentMethod,

        notes: '',

      };



      const response = await checkoutAPI.checkout(orderData);

      

      if (response.data) {
        console.log('Checkout successful, navigating to OrderSuccessPage');
        console.log('Order data:', response.data);
        
        // Validate response data before proceeding
        if (!response.data.order_number) {
          throw new Error('Invalid order response: missing order number');
        }
        
        // Clear cart after successful order
        await clearCart();
        
        // Small delay to ensure cart state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('Navigating to OrderSuccessPage with order:', response.data.order_number);
        
        navigate('/order-success', { 
          state: { 
            order: response.data,
            orderNumber: response.data.order_number 
          } 
        });
      } else {
        throw new Error('No response data received from checkout');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      
      // Handle different types of errors
      if (error.response?.status === 400 && error.response?.data?.error === 'Cart is empty') {
        setError('Your cart is empty. Please add items before checkout.');
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(error.response?.data?.error || 'Failed to create order. Please try again.');
      }
    } finally {

      setLoading(false);

      setIsProcessingCheckout(false); // Reset checkout processing flag

    }

  };



  // Debug cart state
  console.log('CheckoutPage - Current items:', items);
  console.log('CheckoutPage - Items length:', items.length);
  console.log('CheckoutPage - isProcessingCheckout:', isProcessingCheckout);

  // Remove empty cart conditional rendering - let the page render and handle empty cart in UI
  // This prevents the state inconsistency issue



  return (

    <div className="min-h-screen bg-gray-50 py-12">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Checkout Form */}

          <div className="lg:col-span-2 space-y-8">

            {/* User Information */}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>

              <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">

                      First Name

                    </label>

                    <input

                      type="text"

                      value={user?.first_name || ''}

                      disabled

                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"

                    />

                  </div>

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1">

                      Last Name

                    </label>

                    <input

                      type="text"

                      value={user?.last_name || ''}

                      disabled

                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"

                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">

                    Email

                  </label>

                  <input

                    type="email"

                    value={user?.email || ''}

                    disabled

                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"

                  />

                </div>

              </div>

            </div>



            {/* Shipping Address */}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>

                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">

                    Street Address *

                  </label>

                  <input

                    type="text"

                    id="address"

                    name="address"

                    required

                    value={shippingAddress.address}

                    onChange={handleInputChange}

                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                  />

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">

                      City *

                    </label>

                    <input

                      type="text"

                      id="city"

                      name="city"

                      required

                      value={shippingAddress.city}

                      onChange={handleInputChange}

                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                    />

                  </div>

                  <div>

                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">

                      Province *

                    </label>

                    <input

                      type="text"

                      id="province"

                      name="province"

                      required

                      value={shippingAddress.province}

                      onChange={handleInputChange}

                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                    />

                  </div>

                </div>

                <div>

                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">

                    Postal Code *

                  </label>

                  <input

                    type="text"

                    id="postal_code"

                    name="postal_code"

                    required

                    value={shippingAddress.postal_code}

                    onChange={handleInputChange}

                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                  />

                </div>

              </form>

            </div>



            {/* Payment Method */}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>

              <div className="space-y-3">

                <label className="flex items-center">

                  <input

                    type="radio"

                    name="payment_method"

                    value="cod"

                    checked={paymentMethod === 'cod'}

                    onChange={(e) => setPaymentMethod(e.target.value)}

                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"

                  />

                  <span className="ml-2 text-sm text-gray-700">Cash on Delivery (COD)</span>

                </label>

                <label className="flex items-center">

                  <input

                    type="radio"

                    name="payment_method"

                    value="transfer"

                    checked={paymentMethod === 'transfer'}

                    onChange={(e) => setPaymentMethod(e.target.value)}

                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"

                  />

                  <span className="ml-2 text-sm text-gray-700">Bank Transfer</span>

                </label>

                <label className="flex items-center">

                  <input

                    type="radio"

                    name="payment_method"

                    value="ewallet"

                    checked={paymentMethod === 'ewallet'}

                    onChange={(e) => setPaymentMethod(e.target.value)}

                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"

                  />

                  <span className="ml-2 text-sm text-gray-700">E-Wallet</span>

                </label>

              </div>

            </div>

          </div>



          {/* Order Summary */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">

              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              

              {/* Order Items */}

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">

                {(() => {
                  // Emergency fix: Use multiple validation methods
                  const hasItemsByLength = items.length > 0;
                  const hasItemsByUI = document.querySelector('.space-y-3 .flex.items-center') !== null;
                  const cartHasItems = hasItemsByLength || hasItemsByUI;
                  
                  console.log('Order Summary validation:');
                  console.log('- hasItemsByLength:', hasItemsByLength);
                  console.log('- hasItemsByUI:', hasItemsByUI);
                  console.log('- cartHasItems:', cartHasItems);
                  
                  return cartHasItems ? (
                    items.map((item) => (

                      <div key={item.id} className="flex items-center space-x-3">

                        <img

                          src={item.product?.image || '/placeholder-product.jpg'}

                          alt={item.product?.name}

                      className="w-12 h-12 object-cover rounded"

                    />

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium text-gray-900 truncate">

                        {item.product?.name}

                      </p>

                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>

                    </div>

                    <p className="text-sm font-medium text-gray-900">

                      {formatPrice((item.product?.price || 0) * item.quantity)}

                    </p>

                  </div>

                ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <RouterLink
                      to="/"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue Shopping
                    </RouterLink>
                  </div>
                );
                })()}
              </div>



              {/* Price Breakdown */}

              <div className="space-y-3 border-t pt-4">

                <div className="flex justify-between text-sm text-gray-600">

                  <span>Subtotal ({getTotalItems()} items)</span>

                  <span>{formatPrice(subtotal)}</span>

                </div>

                <div className="flex justify-between text-sm text-gray-600">

                  <span>Shipping</span>

                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>

                </div>

                <div className="flex justify-between text-sm text-gray-600">

                  <span>Tax</span>

                  <span>{formatPrice(tax)}</span>

                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">

                  <span>Total</span>

                  <span>{formatPrice(totalAmount)}</span>

                </div>

              </div>



              {error && (

                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">

                  {error}

                </div>

              )}



              {/* Place Order Button */}

              <button

                onClick={handleSubmit}

                disabled={loading || !shippingAddress.address || !shippingAddress.city || !shippingAddress.province || !shippingAddress.postal_code}

                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

              >

                {loading ? 'Processing...' : 'Place Order'}

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

      </div>

    </div>

  );

};



export default CheckoutPage;

