import React from 'react';

const AdminAnalytics: React.FC = () => {
  const salesData = [
    { month: 'Jan', sales: 4000, orders: 120 },
    { month: 'Feb', sales: 3000, orders: 98 },
    { month: 'Mar', sales: 5000, orders: 145 },
    { month: 'Apr', sales: 4500, orders: 132 },
    { month: 'May', sales: 6000, orders: 178 },
    { month: 'Jun', sales: 5500, orders: 165 },
  ];

  const topCategories = [
    { name: 'Electronics', sales: 12500, percentage: 45, color: 'bg-blue-500' },
    { name: 'Clothing', sales: 8900, percentage: 32, color: 'bg-green-500' },
    { name: 'Accessories', sales: 4500, percentage: 16, color: 'bg-yellow-500' },
    { name: 'Home & Garden', sales: 1800, percentage: 7, color: 'bg-purple-500' },
  ];

  const recentActivity = [
    { type: 'sale', description: 'New order #ORD-123', amount: '$234.56', time: '2 minutes ago' },
    { type: 'user', description: 'New user registered', amount: 'john@example.com', time: '15 minutes ago' },
    { type: 'sale', description: 'New order #ORD-122', amount: '$89.99', time: '1 hour ago' },
    { type: 'product', description: 'Product "Wireless Mouse" added', amount: '', time: '2 hours ago' },
    { type: 'sale', description: 'New order #ORD-121', amount: '$456.78', time: '3 hours ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return '💰';
      case 'user': return '👤';
      case 'product': return '📦';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track your store performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$28,000</p>
              <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
            </div>
            <div className="text-3xl">💵</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">838</p>
              <p className="text-sm text-green-600 mt-1">+8.2% from last month</p>
            </div>
            <div className="text-3xl">🛒</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">3.2%</p>
              <p className="text-sm text-red-600 mt-1">-0.5% from last month</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">$33.42</p>
              <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
          <div className="space-y-4">
            {salesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-12">{item.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className="bg-indigo-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.sales / 6000) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">${item.sales}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 w-16 text-right">{item.orders} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h2>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900">${category.sales.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              {activity.amount && (
                <span className="text-sm font-medium text-gray-900">{activity.amount}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Best Performing</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Best Day</span>
                <span className="font-medium text-gray-900">Saturday</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Best Time</span>
                <span className="font-medium text-gray-900">2:00 PM - 4:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Top Product</span>
                <span className="font-medium text-gray-900">Wireless Headphones</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Customer Behavior</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Session Duration</span>
                <span className="font-medium text-gray-900">4m 32s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bounce Rate</span>
                <span className="font-medium text-gray-900">32.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Return Customer Rate</span>
                <span className="font-medium text-gray-900">28.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
