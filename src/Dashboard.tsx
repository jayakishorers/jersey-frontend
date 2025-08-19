import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User,
  Mail,
  Phone,
  Heart,
  Package,
  Eye,
  X,
  Bell,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Calendar,
  ShoppingBag,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Home,
  LogOut,
  Trash2,
  Download,
  Star,
  Filter,
  Search,
  RefreshCw,
  MessageCircle,
  Dot
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

interface Message {
  _id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  read: boolean;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const wishCount = Array.isArray(wishlist) ? wishlist.length : 0;
  const unreadMessages = messages.filter(msg => !msg.read).length;

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchOrders();
    fetchMessages();
  }, [token, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://jerseybackend.onrender.com/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 50 },
      });

      if (res.data.success) {
        setOrders(res.data.data.orders);
        setError(null);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await axios.get('https://jerseybackend.onrender.com/api/messages/my-messages', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessages(res.data.data.messages);
      }
    } catch (err) {
      console.error('Messages fetch error:', err);
    } finally {
      setMessagesLoading(false);
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
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`https://jerseybackend.onrender.com/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch {
      alert('Failed to delete order.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'shipped': return 'text-blue-700 bg-blue-100';
      case 'processing': return 'text-yellow-700 bg-yellow-100';
      case 'confirmed': return 'text-purple-700 bg-purple-100';
      case 'pending': return 'text-orange-700 bg-orange-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.orderStatus === orderFilter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const downloadOrderReceipt = (order: Order) => {
    const receiptContent = [
      `Order Receipt - ${order.orderNumber}`,
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      `Status: ${order.orderStatus}`,
      `Total: ₹${order.totalAmount}`,
      '',
      'Items:',
      ...order.items.map(item => `- ${item.name} (${item.size}) x${item.quantity} - ₹${item.price}`),
      '',
      'Shipping Address:',
      `${order.shippingAddress.name}`,
      `${order.shippingAddress.address}`,
      `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`,
      `Phone: ${order.shippingAddress.contactNumber}`
    ].join('\n');

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${order.orderNumber}.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 pt-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Dashboard
            </h1>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-gray-600" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <p className="mt-3 text-gray-600">Welcome back!</p>
            </div>

            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user?.name || 'User'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{user?.email || 'N/A'}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700">{wishCount} Wishlist Items</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{orders.length} Total Orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Panel */}
        {showMessages && (
          <div className="bg-white rounded-xl border border-gray-200 mb-8 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                Messages
                {unreadMessages > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessages} new
                  </span>
                )}
              </h3>
              <button
                onClick={() => setShowMessages(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {messagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No messages yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {messages.map(message => (
                    <div
                      key={message._id}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !message.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => markMessageAsRead(message._id)}
                    >
                      <div className="flex items-start space-x-3">
                        {getMessageIcon(message.type)}
                        <div className="flex-1">
                          <p className="text-gray-900">{message.message}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!message.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Your Orders</h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <button
                  onClick={fetchOrders}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  title="Refresh Orders"
                >
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {error && (
            <div className="px-6 py-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {searchTerm || orderFilter !== 'all' ? 'No orders match your filters' : 'You have no orders yet'}
              </p>
            </div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <div 
                  key={order._id} 
                  className="px-6 py-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h4>
                        <p className="text-gray-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="capitalize">{order.orderStatus}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Items</p>
                      <p className="text-gray-900">{order.items.length} items</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Payment</p>
                      <p className="text-gray-900 capitalize">{order.paymentStatus}</p>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <p className="text-gray-500 font-medium">Tracking</p>
                        <p className="text-gray-900">{order.trackingNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 font-medium">Delivery to</p>
                      <p className="text-gray-900">{order.shippingAddress.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => downloadOrderReceipt(order)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Receipt</span>
                    </button>
                    
                    {order.orderStatus === 'pending' && (
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6 text-gray-900">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Order Number:</span> <span className="text-gray-900 font-medium">{selectedOrder.orderNumber}</span></p>
                      <p><span className="text-gray-500">Status:</span> 
                        <span className={`ml-2 inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                          {getStatusIcon(selectedOrder.orderStatus)}
                          <span className="capitalize">{selectedOrder.orderStatus}</span>
                        </span>
                      </p>
                      <p><span className="text-gray-500">Payment Status:</span> <span className="text-gray-900 font-medium capitalize">{selectedOrder.paymentStatus}</span></p>
                      <p><span className="text-gray-500">Total Amount:</span> <span className="text-gray-900 font-medium">₹{selectedOrder.totalAmount}</span></p>
                      <p><span className="text-gray-500">Order Date:</span> <span className="text-gray-900 font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
                      {selectedOrder.trackingNumber && (
                        <p><span className="text-gray-500">Tracking Number:</span> <span className="text-gray-900 font-medium">{selectedOrder.trackingNumber}</span></p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-900 font-medium">{selectedOrder.shippingAddress.name}</p>
                        <p className="text-gray-700">{selectedOrder.shippingAddress.address}</p>
                        <p className="text-gray-700">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.district}</p>
                        <p className="text-gray-700">{selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                        <p className="text-gray-700">📞 {selectedOrder.shippingAddress.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({selectedOrder.items.length})</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-4">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-300" />
                          )}
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-medium">{item.name}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                              <p><span className="text-gray-500">Type:</span> <span className="text-gray-900">{item.type}</span></p>
                              <p><span className="text-gray-500">Size:</span> <span className="text-gray-900">{item.size}</span></p>
                              <p><span className="text-gray-500">Quantity:</span> <span className="text-gray-900">{item.quantity}</span></p>
                              <p><span className="text-gray-500">Price:</span> <span className="text-gray-900">₹{item.price}</span></p>
                            </div>
                            {item.isFullSleeve && (
                              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Full Sleeve</span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => downloadOrderReceipt(selectedOrder)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </button>
                  
                  {selectedOrder.orderStatus === 'pending' && (
                    <button
                      onClick={() => {
                        handleDelete(selectedOrder._id);
                        setSelectedOrder(null);
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;