import React from 'react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+12.5%', changeType: 'positive' },
    { label: 'Total Orders', value: '1,234', change: '+8.2%', changeType: 'positive' },
    { label: 'Total Customers', value: '892', change: '+4.1%', changeType: 'positive' },
    { label: 'Conversion Rate', value: '3.2%', change: '-0.5%', changeType: 'negative' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '$123.45', status: 'Completed', date: '2024-01-10' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: '$89.99', status: 'Processing', date: '2024-01-10' },
    { id: 'ORD-003', customer: 'Bob Johnson', amount: '$234.56', status: 'Pending', date: '2024-01-09' },
    { id: 'ORD-004', customer: 'Alice Brown', amount: '$67.89', status: 'Completed', date: '2024-01-09' },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 234, revenue: '$23,400' },
    { name: 'Smart Watch', sales: 189, revenue: '$18,900' },
    { name: 'Laptop Stand', sales: 156, revenue: '$7,800' },
    { name: 'USB-C Cable', sales: 143, revenue: '$2,860' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard. Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${
                stat.changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {stat.changeType === 'positive' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  )}
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all</button>
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
                    <td className="px-4 py-3 text-sm text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
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
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
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
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</div>
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">Add Product</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">View Reports</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">Manage Users</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">Settings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
