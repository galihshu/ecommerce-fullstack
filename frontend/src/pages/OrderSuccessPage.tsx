import React, { useEffect, useState } from 'react';

import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { useCart } from '../context/CartContext';



const OrderSuccessPage: React.FC = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const { refreshCart } = useCart();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const orderData = location.state as { order: any; orderNumber: string } | null;

  // Refresh cart to ensure it's empty and ready for new shopping
  useEffect(() => {
    const refreshCartAsync = async () => {
      setIsRefreshing(true);
      try {
        console.log('OrderSuccessPage: Refreshing cart after successful order');
        await refreshCart();
        console.log('OrderSuccessPage: Cart refreshed successfully');
      } catch (error) {
        console.error('OrderSuccessPage: Failed to refresh cart:', error);
        // Don't block the page if cart refresh fails
      } finally {
        setIsRefreshing(false);
      }
    };
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('OrderSuccessPage: Cart refresh timeout, forcing loading to false');
      setIsRefreshing(false);
    }, 3000); // Reduced to 3 seconds
    
    refreshCartAsync();
    
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array to run only once



  const formatPrice = (price: number) => {

    return new Intl.NumberFormat('id-ID', {

      style: 'currency',

      currency: 'IDR',

      minimumFractionDigits: 0,

    }).format(price);

  };



  if (isRefreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your cart for next shopping...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    console.log('OrderSuccessPage: No order data found, redirecting to home');
    // If no order data, redirect to home with a message
    navigate('/', { 
      state: { 
        message: 'Order completed successfully. You can continue shopping.' 
      } 
    });
    return null;
  }

  console.log('OrderSuccessPage: Order data received:', orderData);



  const { order, orderNumber } = orderData;



  return (

    <div className="min-h-screen bg-gray-50 py-12">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center">

          {/* Success Icon */}

          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">

            <svg

              className="h-8 w-8 text-green-600"

              fill="none"

              stroke="currentColor"

              viewBox="0 0 24 24"

            >

              <path

                strokeLinecap="round"

                strokeLinejoin="round"

                strokeWidth={2}

                d="M5 13l4 4L19 7"

              />

            </svg>

          </div>



          {/* Success Message */}

          <h1 className="text-3xl font-bold text-gray-900 mb-4">

            Order Placed Successfully!

          </h1>

          <p className="text-lg text-gray-600 mb-8">

            Thank you for your order. We've received your order and will begin processing it right away.

          </p>



          {/* Order Details Card */}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-left mb-8">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-gray-900 mb-2">Order Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <p className="text-sm text-gray-500">Order Number</p>

                  <p className="font-semibold text-gray-900">{orderNumber}</p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">Order Date</p>

                  <p className="font-semibold text-gray-900">

                    {new Date().toLocaleDateString('en-US', {

                      year: 'numeric',

                      month: 'long',

                      day: 'numeric',

                    })}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">Payment Method</p>

                  <p className="font-semibold text-gray-900 capitalize">

                    {order.payment_method?.replace('_', ' ') || 'N/A'}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">Order Status</p>

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">

                    {order.status || 'Pending'}

                  </span>

                </div>

              </div>

            </div>



            {/* Shipping Address */}

            <div className="mb-6">

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>

              <p className="text-gray-600">{order.shipping_address}</p>

            </div>



            {/* Order Items */}

            <div className="mb-6">

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>

              <div className="space-y-3">

                {order.order_items?.map((item: any) => (

                  <div key={item.id} className="flex items-center justify-between py-3 border-b">

                    <div className="flex items-center space-x-4">

                      <img

                        src={item.product?.image || '/placeholder-product.jpg'}

                        alt={item.product?.name}

                        className="w-16 h-16 object-cover rounded"

                      />

                      <div>

                        <p className="font-medium text-gray-900">{item.product?.name}</p>

                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="font-medium text-gray-900">

                        {formatPrice(item.total_price)}

                      </p>

                      <p className="text-sm text-gray-500">

                        {formatPrice(item.unit_price)} each

                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>



            {/* Price Summary */}

            <div className="border-t pt-4">

              <div className="space-y-2">

                <div className="flex justify-between text-sm text-gray-600">

                  <span>Subtotal</span>

                  <span>{formatPrice(order.subtotal)}</span>

                </div>

                <div className="flex justify-between text-sm text-gray-600">

                  <span>Shipping</span>

                  <span>{formatPrice(order.shipping_cost)}</span>

                </div>

                <div className="flex justify-between text-sm text-gray-600">

                  <span>Tax</span>

                  <span>{formatPrice(order.tax)}</span>

                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">

                  <span>Total</span>

                  <span>{formatPrice(order.total_amount)}</span>

                </div>

              </div>

            </div>

          </div>



          {/* Action Buttons */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <RouterLink

              to="/"

              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"

            >

              Continue Shopping

            </RouterLink>

            <RouterLink

              to="/orders"

              className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"

            >

              View My Orders

            </RouterLink>

          </div>



          {/* Additional Information */}

          <div className="mt-12 bg-blue-50 rounded-lg p-6 text-left">

            <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>

            <div className="space-y-3 text-sm text-blue-800">

              <div className="flex items-start">

                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

                </svg>

                <p>You'll receive an order confirmation email shortly with all the details.</p>

              </div>

              <div className="flex items-start">

                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

                </svg>

                <p>We'll process your order within 1-2 business days.</p>

              </div>

              <div className="flex items-start">

                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

                </svg>

                <p>You'll receive tracking information once your order has been shipped.</p>

              </div>

              <div className="flex items-start">

                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />

                </svg>

                <p>For any questions, please contact our customer support at support@ecommerce.com</p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};



export default OrderSuccessPage;

