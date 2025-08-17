import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  ShoppingCart,
  MessageSquare,
  Download,
  LogOut,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  TrendingUp,
  Search,
  Filter,
  BarChart3,
  DollarSign,
  Calendar,
  Bell,
  Settings,
  Home,
  RefreshCw,
  Edit3,
  Send,
  ChevronRight,
  ChevronDown,
  Star,
  MapPin,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size: string;
  type: string;
  isFullSleeve: boolean;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    contactNumber: string;
  };
  trackingNumber?: string;
  notes?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  isVerified: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

interface Message {
  _id?: string;
  userId: string;
  userName: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  read: boolean;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'users' | 'messages'>('dashboard');
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Loading states
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  // Filter and search states
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  
  // Message sending state
  const [newMessage, setNewMessage] = useState({ userId: '', message: '', type: 'info' as const });
  const [sendingMessage, setSendingMessage] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.email === '123@gmail.com') {
          setIsAdmin(true);
          fetchAllData();
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }

    setLoading(false);
  }, [navigate, token]);

  const fetchAllData = () => {
    fetchOrders();
    fetchUsers();
    fetchMessages();
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await axios.get('https://jerseybackend.onrender.com/api/orders/all-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axios.get('https://jerseybackend.onrender.com/api/users/all-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const response = await axios.get('https://jerseybackend.onrender.com/api/messages/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await axios.patch(
        `https://jerseybackend.onrender.com/api/orders/${orderId}/status`,
        { orderStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, orderStatus: status } : order
        ));
        
        // Send notification to user
        const order = orders.find(o => o._id === orderId);
        if (order) {
          await sendMessage(order.userId._id, `Your order ${order.orderNumber} status has been updated to: ${status}`, 'info');
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const sendMessage = async (userId: string, message: string, type: 'info' | 'warning' | 'success' | 'error') => {
    setSendingMessage(true);
    try {
      const response = await axios.post(
        'https://jerseybackend.onrender.com/api/messages/send',
        { userId, message, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMessages(prev => [response.data.data.message, ...prev]);
        setNewMessage({ userId: '', message: '', type: 'info' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      ['Order Number', 'Customer Name', 'Email', 'Total Amount', 'Status', 'Payment Status', 'Date', 'Items Count'],
      ...orders.map(order => [
        order.orderNumber,
        order.userId.name,
        order.userId.email,
        order.totalAmount.toString(),
        order.orderStatus,
        order.paymentStatus,
        new Date(order.createdAt).toLocaleDateString(),
        order.items.length.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  // Filter functions
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                         order.userId.name.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                         order.userId.email.toLowerCase().includes(orderSearchTerm.toLowerCase());
    
    const matchesStatus = orderStatusFilter === 'all' || order.orderStatus === orderStatusFilter;
    
    const matchesDate = dateRange === 'all' || (() => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      switch (dateRange) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          return (now.getTime() - orderDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return (now.getTime() - orderDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Analytics calculations
  const analytics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pendingOrders: orders.filter(order => order.orderStatus === 'pending').length,
    completedOrders: orders.filter(order => order.orderStatus === 'delivered').length,
    totalUsers: users.length,
    newUsersThisMonth: users.filter(user => {
      const userDate = new Date(user.createdAt);
      const now = new Date();
      return now.getTime() - userDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAllData}
                className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/40 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-1 bg-black/30 rounded-lg mb-6">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { key: 'orders', label: 'Orders', icon: ShoppingCart },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'messages', label: 'Messages', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-white">{analytics.totalOrders}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">₹{analytics.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 text-sm">Pending Orders</p>
                    <p className="text-3xl font-bold text-white">{analytics.pendingOrders}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-white">{analytics.completedOrders}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-pink-600/20 to-pink-800/20 backdrop-blur-md rounded-xl p-6 border border-pink-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-300 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white">{analytics.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-pink-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-teal-600/20 to-teal-800/20 backdrop-blur-md rounded-xl p-6 border border-teal-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-300 text-sm">New Users</p>
                    <p className="text-3xl font-bold text-white">{analytics.newUsersThisMonth}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-teal-400" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-700/50">
                {orders.slice(0, 5).map(order => (
                  <div key={order._id} className="px-6 py-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.orderNumber}</p>
                          <p className="text-gray-400 text-sm">{order.userId.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">₹{order.totalAmount}</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === 'delivered' ? 'bg-green-600/20 text-green-300' :
                          order.orderStatus === 'pending' ? 'bg-yellow-600/20 text-yellow-300' :
                          order.orderStatus === 'shipped' ? 'bg-blue-600/20 text-blue-300' :
                          'bg-gray-600/20 text-gray-300'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Order Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="pl-10 pr-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <select
                    className="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <select
                    className="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                
                <button
                  onClick={downloadCSV}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden">
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/50">
                  {filteredOrders.map(order => (
                    <div key={order._id} className="px-6 py-6 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold text-white">{order.orderNumber}</h3>
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              order.orderStatus === 'delivered' ? 'bg-green-600/20 text-green-300' :
                              order.orderStatus === 'pending' ? 'bg-yellow-600/20 text-yellow-300' :
                              order.orderStatus === 'shipped' ? 'bg-blue-600/20 text-blue-300' :
                              order.orderStatus === 'cancelled' ? 'bg-red-600/20 text-red-300' :
                              'bg-gray-600/20 text-gray-300'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Customer</p>
                              <p className="text-white">{order.userId.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Amount</p>
                              <p className="text-white font-semibold">₹{order.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Items</p>
                              <p className="text-white">{order.items.length} items</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Date</p>
                              <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="px-3 py-1 bg-white/10 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-600/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Search */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Users List */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden">
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/50">
                  {filteredUsers.map(user => (
                    <div key={user._id} className="px-6 py-6 hover:bg-white/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                            {user.isVerified && (
                              <CheckCircle className="w-4 h-4 text-green-400" aria-label="Verified" />

                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{user.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setNewMessage({ ...newMessage, userId: user._id })}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 text-sm"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            {/* Send Message Form */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4">Send Message to User</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newMessage.userId}
                  onChange={(e) => setNewMessage({ ...newMessage, userId: e.target.value })}
                  className="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name} - {user.email}</option>
                  ))}
                </select>
                
                <select
                  value={newMessage.type}
                  onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value as any })}
                  className="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                
                <div className="flex space-x-2">
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    placeholder="Enter message..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={1}
                  />
                  <button
                    onClick={() => sendMessage(newMessage.userId, newMessage.message, newMessage.type)}
                    disabled={!newMessage.userId || !newMessage.message || sendingMessage}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Recent Messages</h2>
              </div>
              {messagesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/50">
                  {messages.map((message, index) => (
                    <div key={message._id || index} className="px-6 py-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            message.type === 'success' ? 'bg-green-600/20 text-green-400' :
                            message.type === 'warning' ? 'bg-yellow-600/20 text-yellow-400' :
                            message.type === 'error' ? 'bg-red-600/20 text-red-400' :
                            'bg-blue-600/20 text-blue-400'
                          }`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                             message.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                             message.type === 'error' ? <XCircle className="w-5 h-5" /> :
                             <Bell className="w-5 h-5" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-white font-medium">{message.userName}</p>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              message.type === 'success' ? 'bg-green-600/20 text-green-300' :
                              message.type === 'warning' ? 'bg-yellow-600/20 text-yellow-300' :
                              message.type === 'error' ? 'bg-red-600/20 text-red-300' :
                              'bg-blue-600/20 text-blue-300'
                            }`}>
                              {message.type}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {new Date(message.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-300">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Order Number:</span> <span className="text-white font-medium">{selectedOrder.orderNumber}</span></p>
                      <p><span className="text-gray-400">Status:</span> <span className="text-white font-medium">{selectedOrder.orderStatus}</span></p>
                      <p><span className="text-gray-400">Payment Status:</span> <span className="text-white font-medium">{selectedOrder.paymentStatus}</span></p>
                      <p><span className="text-gray-400">Total Amount:</span> <span className="text-white font-medium">₹{selectedOrder.totalAmount}</span></p>
                      <p><span className="text-gray-400">Date:</span> <span className="text-white font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
                      {selectedOrder.trackingNumber && (
                        <p><span className="text-gray-400">Tracking:</span> <span className="text-white font-medium">{selectedOrder.trackingNumber}</span></p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Name:</span> <span className="text-white font-medium">{selectedOrder.userId.name}</span></p>
                      <p><span className="text-gray-400">Email:</span> <span className="text-white font-medium">{selectedOrder.userId.email}</span></p>
                      {selectedOrder.userId.phone && (
                        <p><span className="text-gray-400">Phone:</span> <span className="text-white font-medium">{selectedOrder.userId.phone}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Shipping Address</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><span className="text-gray-400">Name:</span> <span className="text-white">{selectedOrder.shippingAddress.name}</span></p>
                    <p><span className="text-gray-400">Email:</span> <span className="text-white">{selectedOrder.shippingAddress.email}</span></p>
                    <p><span className="text-gray-400">Phone:</span> <span className="text-white">{selectedOrder.shippingAddress.contactNumber}</span></p>
                    <p><span className="text-gray-400">Address:</span> <span className="text-white">{selectedOrder.shippingAddress.address}</span></p>
                    <p><span className="text-gray-400">City:</span> <span className="text-white">{selectedOrder.shippingAddress.city}</span></p>
                    <p><span className="text-gray-400">District:</span> <span className="text-white">{selectedOrder.shippingAddress.district}</span></p>
                    <p><span className="text-gray-400">State:</span> <span className="text-white">{selectedOrder.shippingAddress.state}</span></p>
                    <p><span className="text-gray-400">Pincode:</span> <span className="text-white">{selectedOrder.shippingAddress.pincode}</span></p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.name}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                            <p><span className="text-gray-400">Type:</span> <span className="text-white">{item.type}</span></p>
                            <p><span className="text-gray-400">Size:</span> <span className="text-white">{item.size}</span></p>
                            <p><span className="text-gray-400">Qty:</span> <span className="text-white">{item.quantity}</span></p>
                            <p><span className="text-gray-400">Price:</span> <span className="text-white">₹{item.price}</span></p>
                          </div>
                          {item.isFullSleeve && (
                            <span className="inline-block mt-2 px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">Full Sleeve</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Notes</h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;