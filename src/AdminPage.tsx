import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, ShoppingCart, MessageSquare, Download, LogOut, Eye, CheckCircle, XCircle, Clock, Truck, Package, TrendingUp, Search, Filter, BarChart3, DollarSign, Calendar, Bell, Settings, Home, RefreshCw, Edit3, Send, ChevronRight, ChevronDown, Star, MapPin, Phone, Mail, AlertCircle, PieChart, Activity, Target, Zap, Globe, UserPlus, ShoppingBag, CreditCard, ArrowUp, ArrowDown, MessageCircle, Podcast as Broadcast, Shirt, Plus, Minus, Save, X, Info } from 'lucide-react';

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
  isBroadcast?: boolean;
}

interface BroadcastGroup {
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  count: number;
  users: string[];
}

interface Jersey {
  _id: string;
  name: string;
  image: string;
  sizes: string[];
  currentStock: { [key: string]: number };
  price: number;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'users' | 'messages' | 'stock'>('dashboard');
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedBroadcast, setSelectedBroadcast] = useState<BroadcastGroup | null>(null);
  
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
  const [broadcastMessage, setBroadcastMessage] = useState({ message: '', type: 'info' as const });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem('token');

  // Dummy jersey data - replace with real data from your backend
  const dummyJerseys: Jersey[] = [
    {
      _id: '1',
      name: 'Manchester United Home Jersey',
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      currentStock: { S: 15, M: 20, L: 25, XL: 18, XXL: 10 },
      price: 2499
    },
    {
      _id: '2',
      name: 'Barcelona Away Jersey',
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      currentStock: { S: 12, M: 18, L: 22, XL: 15, XXL: 8 },
      price: 2399
    },
    {
      _id: '3',
      name: 'Real Madrid Third Kit',
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      currentStock: { S: 10, M: 16, L: 20, XL: 12, XXL: 6 },
      price: 2599
    }
  ];

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

  useEffect(() => {
    // Initialize dummy jersey data
    setJerseys(dummyJerseys);
  }, []);

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
      const response = await axios.get("https://jerseybackend.onrender.com/api/auth/all-users", {
        headers: { Authorization: `Bearer ${token}` },
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
        const fetchedMessages = response.data.data.messages.map((msg: any) => ({
          ...msg,
          read: msg.read || false
        }));
        setMessages(fetchedMessages);
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
      alert('Failed to update order status. Please try again.');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await axios.delete(
        `https://jerseybackend.onrender.com/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
        alert('Order deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
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
        setMessages(prev => [{ ...response.data.data.message, read: false }, ...prev]);
        setNewMessage({ userId: '', message: '', type: 'info' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const sendBroadcastMessage = async () => {
    if (!broadcastMessage.message.trim()) return;
    
    setSendingBroadcast(true);
    try {
      const promises = users.map(user => 
        axios.post(
          'https://jerseybackend.onrender.com/api/messages/send',
          { 
            userId: user._id, 
            message: broadcastMessage.message, 
            type: broadcastMessage.type,
            isBroadcast: true 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      
      await Promise.all(promises);
      setBroadcastMessage({ message: '', type: 'info' });
      fetchMessages(); // Refresh messages
      alert('Broadcast message sent to all users successfully!');
    } catch (error) {
      console.error('Error sending broadcast message:', error);
      alert('Failed to send broadcast message');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await axios.patch(
        `https://jerseybackend.onrender.com/api/messages/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const updateStock = (jerseyId: string, size: string, change: number) => {
    setJerseys(prev => prev.map(jersey => {
      if (jersey._id === jerseyId) {
        const newStock = Math.max(0, jersey.currentStock[size] + change);
        return {
          ...jersey,
          currentStock: {
            ...jersey.currentStock,
            [size]: newStock
          }
        };
      }
      return jersey;
    }));
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

  // Group broadcast messages
  const groupedBroadcasts = (): BroadcastGroup[] => {
    const broadcastMap = new Map<string, BroadcastGroup>();
    
    messages.forEach(message => {
      if (message.isBroadcast) {
        const key = `${message.message}_${message.type}_${new Date(message.createdAt).toDateString()}`;
        
        if (broadcastMap.has(key)) {
          const existing = broadcastMap.get(key)!;
          existing.count += 1;
          existing.users.push(message.userName);
        } else {
          broadcastMap.set(key, {
            message: message.message,
            type: message.type,
            createdAt: message.createdAt,
            count: 1,
            users: [message.userName]
          });
        }
      }
    });
    
    return Array.from(broadcastMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const individualMessages = messages.filter(msg => !msg.isBroadcast);

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
    }).length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
    conversionRate: users.length > 0 ? (orders.length / users.length) * 100 : 0,
    unreadMessages: messages.filter(msg => !msg.read).length
  };

  // Chart data for orders by status
  const ordersByStatus = {
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchAllData}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors text-green-700"
              >
                <Home className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-red-700"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex mt-3 space-x-1 overflow-x-auto pb-1">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { key: 'orders', label: 'Orders', icon: ShoppingCart },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'messages', label: 'Messages', icon: MessageSquare },
              { key: 'stock', label: 'Stock', icon: Shirt }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
                {tab.key === 'messages' && analytics.unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {analytics.unreadMessages}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAllData}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors text-green-700"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-red-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Navigation Tabs */}
        <div className="hidden lg:flex space-x-1 p-1 bg-gray-100 rounded-lg mb-6">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { key: 'orders', label: 'Orders', icon: ShoppingCart },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'messages', label: 'Messages', icon: MessageSquare },
            { key: 'stock', label: 'Stock Management', icon: Shirt }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.key === 'messages' && analytics.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {analytics.unreadMessages}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">₹{analytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-green-600 text-sm mt-1">
                    </p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{analytics.totalOrders}</p>
                    <p className="text-blue-600 text-sm mt-1">
                      
                    </p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Users</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
                    <p className="text-purple-600 text-sm mt-1">
                      <ArrowUp className="w-4 h-4 inline mr-1" />
                      +{analytics.newUsersThisMonth} this month
                    </p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Avg Order Value</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">₹{analytics.averageOrderValue.toFixed(0)}</p>
                    <p className="text-orange-600 text-sm mt-1">
                      <Target className="w-4 h-4 inline mr-1" />
                      {analytics.conversionRate.toFixed(1)}% conversion
                    </p>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(ordersByStatus).map(([status, count]) => {
                    const percentage = analytics.totalOrders > 0 ? (count / analytics.totalOrders) * 100 : 0;
                    const colors = {
                      pending: 'bg-yellow-500',
                      confirmed: 'bg-blue-500',
                      processing: 'bg-purple-500',
                      shipped: 'bg-indigo-500',
                      delivered: 'bg-green-500',
                      cancelled: 'bg-red-500'
                    };
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`}></div>
                          <span className="text-gray-700 capitalize">{status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 lg:w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${colors[status as keyof typeof colors]}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-6">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions - Mobile Responsive */}
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center justify-between p-3 lg:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Manage Orders</p>
                        <p className="text-sm text-gray-600">{analytics.pendingOrders} pending orders</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('users')}
                    className="flex items-center justify-between p-3 lg:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">User Management</p>
                        <p className="text-sm text-gray-600">{analytics.newUsersThisMonth} new users</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-purple-600" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="flex items-center justify-between p-3 lg:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Messages</p>
                        <p className="text-sm text-gray-600">{analytics.unreadMessages} unread messages</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-green-600" />
                  </button>

                  <button
                    onClick={() => setActiveTab('stock')}
                    className="flex items-center justify-between p-3 lg:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Shirt className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Stock Management</p>
                        <p className="text-sm text-gray-600">Manage jersey inventory</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-orange-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity - Mobile Responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {orders.slice(0, 5).map(order => (
                  <div key={order._id} className="px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Package className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium text-sm lg:text-base">{order.orderNumber}</p>
                          <p className="text-gray-600 text-xs lg:text-sm">{order.userId.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-medium text-sm lg:text-base">₹{order.totalAmount}</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
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
            {/* Order Controls - Mobile Responsive */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <select
                    className="px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 self-start"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Orders List - Mobile Responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredOrders.map(order => (
                    <div key={order._id} className="px-4 lg:px-6 py-4 lg:py-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                            <h3 className="text-base lg:text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium self-start ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Customer</p>
                              <p className="text-gray-900 font-medium">{order.userId.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Amount</p>
                              <p className="text-gray-900 font-semibold">₹{order.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Items</p>
                              <p className="text-gray-900">{order.items.length} items</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Date</p>
                              <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-3">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
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
            {/* User Search - Mobile Responsive */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Users List - Mobile Responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <div key={user._id} className="px-4 lg:px-6 py-4 lg:py-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start lg:items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm lg:text-lg font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2">
                            <h3 className="text-base lg:text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                            {user.isVerified && (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" aria-label="Verified" />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-600 truncate">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-600">{user.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setNewMessage({ ...newMessage, userId: user._id });
                            setActiveTab('messages');
                          }}
                          className="px-3 lg:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm flex-shrink-0"
                        >
                          <span className="hidden sm:inline">Send Message</span>
                          <MessageCircle className="w-4 h-4 sm:hidden" />
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
            {/* Broadcast Message - Mobile Responsive */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Broadcast className="w-5 h-5 mr-2 text-blue-600" />
                Broadcast Message to All Users
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <select
                  value={broadcastMessage.type}
                  onChange={(e) => setBroadcastMessage({ ...broadcastMessage, type: e.target.value as any })}
                  className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                
                <div className="lg:col-span-2">
                  <textarea
                    value={broadcastMessage.message}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, message: e.target.value })}
                    placeholder="Enter broadcast message..."
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
                
                <button
                  onClick={sendBroadcastMessage}
                  disabled={!broadcastMessage.message || sendingBroadcast}
                  className="px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {sendingBroadcast ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Broadcast className="w-4 h-4 mr-2" />}
                  {sendingBroadcast ? 'Sending...' : 'Broadcast'}
                </button>
              </div>
            </div>

            {/* Send Individual Message - Mobile Responsive */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Send Message to Individual User</h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <select
                  value={newMessage.userId}
                  onChange={(e) => setNewMessage({ ...newMessage, userId: e.target.value })}
                  className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name} - {user.email}</option>
                  ))}
                </select>
                
                <select
                  value={newMessage.type}
                  onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value as any })}
                  className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  placeholder="Enter message..."
                  className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
                
                <button
                  onClick={() => sendMessage(newMessage.userId, newMessage.message, newMessage.type)}
                  disabled={!newMessage.userId || !newMessage.message || sendingMessage}
                  className="px-4 lg:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {sendingMessage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {sendingMessage ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>

            {/* Broadcast Messages Section */}
            {groupedBroadcasts().length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Broadcast Messages</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {groupedBroadcasts().map((broadcast, index) => (
                    <div key={index} className="px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Broadcast className="w-4 h-4 text-blue-600" />
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              broadcast.type === 'success' ? 'bg-green-100 text-green-800' :
                              broadcast.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              broadcast.type === 'error' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {broadcast.type}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {new Date(broadcast.createdAt).toLocaleString()}
                            </span>
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {broadcast.count} recipients
                            </span>
                          </div>
                          <p className="text-gray-700">{broadcast.message}</p>
                        </div>
                        <button
                          onClick={() => setSelectedBroadcast(broadcast)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors ml-4"
                          title="View Recipients"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Messages List - Mobile Responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Individual Messages</h2>
              </div>
              {messagesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : individualMessages.length === 0 ? (
                <div className="px-4 lg:px-6 py-8 text-center text-gray-500">
                  No individual messages yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {individualMessages.map((message, index) => (
                    <div 
                      key={message._id || index} 
                      className={`px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !message.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => message._id && markMessageAsRead(message._id)}
                    >
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'success' ? 'bg-green-100 text-green-600' :
                          message.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          message.type === 'error' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {message.type === 'success' ? <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" /> :
                           message.type === 'warning' ? <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" /> :
                           message.type === 'error' ? <XCircle className="w-4 h-4 lg:w-5 lg:h-5" /> :
                           <Bell className="w-4 h-4 lg:w-5 lg:h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-1">
                            <p className="text-gray-900 font-medium">{message.userName}</p>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium self-start ${
                              message.type === 'success' ? 'bg-green-100 text-green-800' :
                              message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              message.type === 'error' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {message.type}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-1">{message.message}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {!message.read ? (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stock Management Tab */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center">
                  <Shirt className="w-5 h-5 mr-2 text-blue-600" />
                  Jersey Stock Management
                </h2>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2">
                  <div className="flex items-center text-yellow-800">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Demo Mode - Changes not saved</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {jerseys.map(jersey => (
                  <div key={jersey._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img 
                        src={jersey.image} 
                        alt={jersey.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{jersey.name}</h3>
                      <p className="text-gray-600 mb-4">₹{jersey.price.toLocaleString()}</p>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Stock by Size:</h4>
                        {jersey.sizes.map(size => (
                          <div key={size} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-700 w-8">{size}</span>
                              <span className={`text-sm px-2 py-1 rounded ${
                                jersey.currentStock[size] < 5 
                                  ? 'bg-red-100 text-red-800' 
                                  : jersey.currentStock[size] < 10 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {jersey.currentStock[size]} in stock
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateStock(jersey._id, size, -1)}
                                disabled={jersey.currentStock[size] <= 0}
                                className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              
                              <span className="w-8 text-center font-mono text-sm">
                                {jersey.currentStock[size]}
                              </span>
                              
                              <button
                                onClick={() => updateStock(jersey._id, size, 1)}
                                className="p-1 rounded bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Stock:</span>
                          <span className="font-semibold text-gray-900">
                            {Object.values(jersey.currentStock).reduce((sum, stock) => sum + stock, 0)} units
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Stock Management Features</h3>
                    <ul className="mt-2 text-sm text-blue-700 space-y-1">
                      <li>• Click + or - buttons to adjust stock levels for each size</li>
                      <li>• Red indicates low stock (less than 5 units)</li>
                      <li>• Yellow indicates medium stock (5-9 units)</li>
                      <li>• Green indicates good stock (10+ units)</li>
                      <li>• In production, changes would be saved to the database automatically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-4 lg:px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-4 lg:p-6 space-y-6">
              {/* Order Info - Mobile Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Order Number:</span> <span className="text-gray-900 font-medium">{selectedOrder.orderNumber}</span></p>
                      <p><span className="text-gray-500">Status:</span> <span className="text-gray-900 font-medium">{selectedOrder.orderStatus}</span></p>
                      <p><span className="text-gray-500">Payment Status:</span> <span className="text-gray-900 font-medium">{selectedOrder.paymentStatus}</span></p>
                      <p><span className="text-gray-500">Total Amount:</span> <span className="text-gray-900 font-medium">₹{selectedOrder.totalAmount}</span></p>
                      <p><span className="text-gray-500">Date:</span> <span className="text-gray-900 font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
                      {selectedOrder.trackingNumber && (
                        <p><span className="text-gray-500">Tracking:</span> <span className="text-gray-900 font-medium">{selectedOrder.trackingNumber}</span></p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> <span className="text-gray-900 font-medium">{selectedOrder.userId.name}</span></p>
                      <p><span className="text-gray-500">Email:</span> <span className="text-gray-900 font-medium">{selectedOrder.userId.email}</span></p>
                      {selectedOrder.userId.phone && (
                        <p><span className="text-gray-500">Phone:</span> <span className="text-gray-900 font-medium">{selectedOrder.userId.phone}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                    <p><span className="text-gray-500">Name:</span> <span className="text-gray-900">{selectedOrder.shippingAddress.name}</span></p>
                    <p><span className="text-gray-500">Email:</span> <span className="text-gray-900">{selectedOrder.shippingAddress.email}</span></p>
                    <p><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{selectedOrder.shippingAddress.contactNumber}</span></p>
                    <p><span className="text-gray-500">Address:</span> <span className="text-gray-900">{selectedOrder.shippingAddress.address}</span></p>
                    <p><span className="text-gray-500">City:</span> <span className="text-gray-900">{selectedOrder.shippingAddress.city}</span></p>
                    <p><span className="text-gray-500">District:</span> <span className="text-gray-900">{selectedOrder.shippingAddress.district}</span></p>
                    <p><span className="text-gray-500">State:</span> <span className="text-gray-900">{selectedOrder.shippingAddress.state}</span></p>
                    <p><span className="text-gray-500">Pincode:</span> <span className="text-gray-900">{selectedOrder.shippingAddress.pincode}</span></p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium truncate">{item.name}</p>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2 text-sm">
                            <p><span className="text-gray-500">Type:</span> <span className="text-gray-900">{item.type}</span></p>
                            <p><span className="text-gray-500">Size:</span> <span className="text-gray-900">{item.size}</span></p>
                            <p><span className="text-gray-500">Qty:</span> <span className="text-gray-900">{item.quantity}</span></p>
                            <p><span className="text-gray-500">Price:</span> <span className="text-gray-900">₹{item.price}</span></p>
                          </div>
                          {item.isFullSleeve && (
                            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Full Sleeve</span>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Recipients Modal */}
      {selectedBroadcast && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[70vh] overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 lg:px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Broadcast Recipients</h2>
                <button
                  onClick={() => setSelectedBroadcast(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-4 lg:p-6">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-2">{selectedBroadcast.message}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedBroadcast.type === 'success' ? 'bg-green-100 text-green-800' :
                    selectedBroadcast.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    selectedBroadcast.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedBroadcast.type}
                  </span>
                  <span>{new Date(selectedBroadcast.createdAt).toLocaleString()}</span>
                  <span>{selectedBroadcast.count} recipients</span>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sent to:</h3>
                <div className="space-y-2">
                  {selectedBroadcast.users.map((userName, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-900">{userName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;