import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesChart, setSalesChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [statsRes, ordersRes, productsRes, chartRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getRecentOrders({ limit: 5 }),
        adminAPI.getTopProducts({ limit: 5 }),
        adminAPI.getSalesChart({ days: 7 })
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setTopProducts(productsRes.data);
      setSalesChart(chartRes.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard. Here's what's happening with your store today.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Rp {stats.total_revenue.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-green-600">
                    +{stats.today_revenue > 0 ? 'Today: Rp ' + stats.today_revenue.toLocaleString('id-ID') : 'No sales today'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_orders}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-blue-600">
                    {stats.today_orders} today
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_customers}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-purple-600">
                    {stats.active_users} active
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_products}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-orange-600">
                    {stats.low_stock_products} low stock
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button 
              onClick={() => window.location.href = '/admin/orders'}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{order.order_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {order.user?.first_name} {order.user?.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Rp {order.total_amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <button 
              onClick={() => window.location.href = '/admin/products'}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.product_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.total_sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Rp {product.total_revenue.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Analytics Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Sales Analytics (Last 7 Days)</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-blue-600">
                Rp {(salesChart.reduce((sum, day) => sum + day.revenue, 0) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Orders: <span className="font-semibold text-green-600">
                {salesChart.reduce((sum, day) => sum + day.orders, 0)}
              </span>
            </div>
          </div>
        </div>
        
        {salesChart.length > 0 ? (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-1">Best Day</div>
                <div className="text-xl font-bold text-blue-900">
                  Rp {(() => {
                    const bestDay = salesChart.reduce((best, current) => 
                      current.revenue > best.revenue ? current : best
                    );
                    return (bestDay.revenue / 1000000).toFixed(1);
                  })()}M
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {(() => {
                    const bestDay = salesChart.reduce((best, current) => 
                      current.revenue > best.revenue ? current : best
                    );
                    return new Date(bestDay.date).toLocaleDateString('id-ID', { weekday: 'short' });
                  })()}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900 mb-1">Avg Daily</div>
                <div className="text-xl font-bold text-green-900">
                  Rp {(() => {
                    const activeDays = salesChart.filter(day => day.revenue > 0).length;
                    const avgRevenue = activeDays > 0 ? salesChart.reduce((sum, day) => sum + day.revenue, 0) / activeDays : 0;
                    return (avgRevenue / 1000000).toFixed(1);
                  })()}M
                </div>
                <div className="text-xs text-green-700 mt-1">
                  {(() => {
                    const activeDays = salesChart.filter(day => day.revenue > 0).length;
                    const avgOrders = activeDays > 0 ? salesChart.reduce((sum, day) => sum + day.orders, 0) / activeDays : 0;
                    return avgOrders.toFixed(1) + ' orders/day';
                  })()}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-900 mb-1">Total Orders</div>
                <div className="text-xl font-bold text-purple-900">
                  {salesChart.reduce((sum, day) => sum + day.orders, 0)}
                </div>
                <div className="text-xs text-purple-700 mt-1">
                  Last 7 days
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-sm font-medium text-orange-900 mb-1">Active Days</div>
                <div className="text-xl font-bold text-orange-900">
                  {salesChart.filter(day => day.orders > 0).length}
                </div>
                <div className="text-xs text-orange-700 mt-1">
                  With sales
                </div>
              </div>
            </div>

            {/* Detailed Sales Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesChart.map((data, index) => {
                    const avgOrderValue = data.orders > 0 ? data.revenue / data.orders : 0;
                    const isBestDay = data.revenue === Math.max(...salesChart.map(d => d.revenue)) && data.revenue > 0;
                    
                    return (
                      <tr 
                        key={index} 
                        className={`hover:bg-gray-50 transition-colors ${
                          isBestDay ? 'bg-blue-50 hover:bg-blue-100' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(data.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                            data.orders > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {data.orders}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                          {data.revenue > 0 ? `Rp ${(data.revenue / 1000).toLocaleString('id-ID')}K` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {avgOrderValue > 0 ? `Rp ${avgOrderValue.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isBestDay && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              🏆 Best
                            </span>
                          )}
                          {data.orders === 0 && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                              No Sales
                            </span>
                          )}
                          {data.orders > 0 && !isBestDay && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              ✓ Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Performance Insights */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">📈</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Revenue Trend</div>
                    <div className="text-xs text-gray-600">
                      {(() => {
                        const firstHalf = salesChart.slice(0, Math.floor(salesChart.length / 2));
                        const secondHalf = salesChart.slice(Math.floor(salesChart.length / 2));
                        const firstRevenue = firstHalf.reduce((sum, day) => sum + day.revenue, 0);
                        const secondRevenue = secondHalf.reduce((sum, day) => sum + day.revenue, 0);
                        const trend = secondRevenue > firstRevenue ? 'upward' : secondRevenue < firstRevenue ? 'downward' : 'stable';
                        return trend === 'upward' ? '↗️ Increasing' : trend === 'downward' ? '↘️ Decreasing' : '➡️ Stable';
                      })()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">🎯</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Peak Day</div>
                    <div className="text-xs text-gray-600">
                      {(() => {
                        const bestDay = salesChart.reduce((best, current) => 
                          current.revenue > best.revenue ? current : best
                        );
                        return new Date(bestDay.date).toLocaleDateString('id-ID', { weekday: 'long' });
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No sales data</h3>
              <p className="mt-1 text-sm text-gray-500">No orders found in the last 7 days</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/admin/products?action=add'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</div>
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">Add Product</p>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">View Orders</p>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/users'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">Manage Users</p>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/settings'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">Settings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
