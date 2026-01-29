import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import type { Order, OrderItem } from '../types';

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Image handling with fallback - same as CartItem
  const getImageUrl = (image: string | undefined) => {
    if (!image) {
      return 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image';
    }
    
    // If image is a relative path, add base URL
    if (image.startsWith('/')) {
      return `http://localhost:8080${image}`;
    }
    
    // If image is already a full URL, return as is
    if (image.startsWith('http')) {
      return image;
    }
    
    // Default fallback
    return `http://localhost:8080/uploads/${image}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cod':
        return 'Cash on Delivery';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      setCancelling(true);
      await checkoutAPI.cancelOrder(order.id);
      
      // Update order status locally
      setOrder({ ...order, status: 'cancelled' });
      
      // Show success message
      alert('Order cancelled successfully');
      
      // Optionally redirect to orders page after successful cancellation
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
      
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      const errorMessage = error.response?.data?.error || 'Failed to cancel order. Please try again.';
      alert(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) {
      navigate('/orders');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await checkoutAPI.getOrderDetails(parseInt(id));
        setOrder(response.data);
      } catch (error: any) {
        console.error('Failed to fetch order:', error);
        setError(error.response?.data?.error || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-red-400 mb-6">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 3.162-2.914l.823-2.552c.416-1.284.824-2.684 1.24-4.085L12 4.5l3.758 3.758c.416 1.401.824 2.801 1.24 4.085l.823 2.552c.66 1.247 1.622 2.914 3.162 2.914z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <RouterLink
              to="/orders"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Orders
            </RouterLink>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <RouterLink
            to="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </RouterLink>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order #{order.order_number}</h2>
                  <p className="text-sm text-gray-500">Order ID: #{order.id}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                  {/* Primary Order Status */}
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Order Status</span>
                  </div>
                  
                  {/* Payment Status - only show if different from order status */}
                  {order.payment_status.toLowerCase() !== order.status.toLowerCase() && (
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Payment</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">{formatDate(order.updated_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{getPaymentMethodLabel(order.payment_method)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">{formatPrice(order.total_amount)}</p>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-500 text-sm mb-1">Order Notes</p>
                  <p className="text-gray-900">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.order_items?.map((item: OrderItem) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={getImageUrl(item.product?.image)}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={handleImageError}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.product?.name}</h4>
                      <p className="text-sm text-gray-500 truncate">
                        {item.product?.description?.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="font-medium text-gray-900">{formatPrice(item.unit_price)}</p>
                      <p className="font-bold text-gray-900">{formatPrice(item.total_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Shipping Address</p>
                    <p className="text-gray-600 whitespace-pre-wrap">{order.shipping_address}</p>
                  </div>
                </div>
                
                {order.tracking_number && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V13.618a1 1 0 01-1.447.894L9 9m0 6l6 6m0-6V9a1 1 0 00-1.447.894L9 9m0 6l6-6m6-6V9a1 1 0 00-1.447.894L9 9" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Tracking Number</p>
                      <p className="text-gray-600">{order.tracking_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Cost</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.tax)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium text-gray-900">{getPaymentMethodLabel(order.payment_method)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t space-y-3">
                {order.status === 'pending' && (
                  <>
                    <button 
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Need to cancel this order?{' '}
                        <button 
                          onClick={handleCancelOrder}
                          disabled={cancelling}
                          className="text-red-600 hover:text-red-700 underline font-medium"
                        >
                          Cancel Order
                        </button>
                      </p>
                    </div>
                  </>
                )}
                <RouterLink
                  to="/orders"
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
                >
                  View All Orders
                </RouterLink>
                <RouterLink
                  to="/"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
                >
                  Continue Shopping
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
