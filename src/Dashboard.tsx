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
  RefreshCw
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
      case 'delivered': return 'text-green-400 bg-green-400/20';
      case 'shipped': return 'text-blue-400 bg-blue-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/20';
      case 'confirmed': return 'text-purple-400 bg-purple-400/20';
      case 'pending': return 'text-orange-400 bg-orange-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
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
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
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
  <div className="min-h-screen bg-black text-white pt-20 font-bold">
    {/* Header */}
    <div className="bg-black/80 backdrop-blur-md border-b border-[#39FF14]/40 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-extrabold text-[#39FF14]">
            My Dashboard
          </h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMessages(!showMessages)}
              className="relative p-2 rounded-lg bg-[#39FF14]/10 hover:bg-[#39FF14]/20 transition-colors"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#39FF14]/10 hover:bg-[#39FF14]/20 transition-colors"
            >
              <Home className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Home</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 transition-colors"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Profile Section */}
      <div className="bg-black/70 backdrop-blur-md rounded-xl shadow-xl p-8 border border-[#39FF14]/30 mb-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-[#39FF14]/30 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <p className="mt-3 text-white/70">Welcome back!</p>
          </div>

          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-extrabold text-[#39FF14]">
              {user?.name || 'User'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#39FF14]" />
                <span className="text-white">{user?.email || 'N/A'}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#39FF14]" />
                  <span className="text-white">{user.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-[#39FF14]" />
                <span className="text-white">{wishCount} Wishlist Items</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-[#39FF14]" />
                <span className="text-white">{orders.length} Total Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Panel */}
      {showMessages && (
        <div className="bg-black/70 backdrop-blur-md rounded-xl border border-[#39FF14]/30 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#39FF14]/20 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#39FF14]">Messages</h3>
            <button
              onClick={() => setShowMessages(false)}
              className="p-1 hover:bg-[#39FF14]/10 rounded"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {messagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-white" />
              </div>
            ) : messages.length === 0 ? (
              <div className="px-6 py-8 text-center text-white/60">
                No messages yet
              </div>
            ) : (
              <div className="divide-y divide-[#39FF14]/10">
                {messages.map(message => (
                  <div
                    key={message._id}
                    className={`px-6 py-4 hover:bg-[#39FF14]/5 transition-colors cursor-pointer ${
                      !message.read ? 'bg-[#39FF14]/10' : ''
                    }`}
                    onClick={() => markMessageAsRead(message._id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getMessageIcon(message.type)}
                      <div className="flex-1">
                        <p className="text-white">{message.message}</p>
                        <p className="text-white/60 text-sm mt-1">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!message.read && (
                        <div className="w-2 h-2 bg-[#39FF14] rounded-full"></div>
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
<div className="bg-black backdrop-blur-md rounded-xl border border-green-500/50 overflow-hidden">
  <div className="px-6 py-4 border-b border-green-500/50">
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <h3 className="text-xl font-bold text-white ">Your Orders</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 bg-black border border-green-600 rounded-lg text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 bg-black border border-green-600 rounded-lg text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
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
          className="p-2 bg-green-700/30 hover:bg-green-700/70 rounded-lg transition-colors"
          title="Refresh Orders"
        >
          <RefreshCw className="w-5 h-5 text-green-400" />
        </button>
      </div>
    </div>
  </div>

  {loading && (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="w-8 h-8 animate-spin text-green-500 " />
    </div>
  )}

  {error && (
    <div className="px-6 py-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4 " />
      <p className="text-red-600 font-bold">{error}</p>
    </div>
  )}

  {!loading && !error && filteredOrders.length === 0 && (
    <div className="px-6 py-12 text-center">
      <Package className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <p className="text-white font-bold text-lg">
        {searchTerm || orderFilter !== 'all' ? 'No orders match your filters' : 'You have no orders yet'}
      </p>
    </div>
  )}

  {!loading && !error && filteredOrders.length > 0 && (
    <div className="divide-y divide-green-600/40">
      {filteredOrders.map(order => (
        <div key={order._id} className="px-6 py-6 hover:bg-green-900/30 transition-colors rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 via-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{order.orderNumber}</h4>
                <p className="text-green-400 text-sm font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-extrabold text-white ">₹{order.totalAmount.toFixed(2)}</p>
              <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.orderStatus)} `}>
                {getStatusIcon(order.orderStatus)}
                <span className="capitalize">{order.orderStatus}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <p className="text-green-400 font-bold">Items</p>
              <p className="text-white font-extrabold">{order.items.length} items</p>
            </div>
            <div>
              <p className="text-green-400 font-bold">Payment</p>
              <p className="text-white font-extrabold capitalize">{order.paymentStatus}</p>
            </div>
            {order.trackingNumber && (
              <div>
                <p className="text-green-400 font-bold">Tracking</p>
                <p className="text-white font-extrabold">{order.trackingNumber}</p>
              </div>
            )}
            <div>
              <p className="text-green-400 font-bold">Delivery to</p>
              <p className="text-white font-extrabold">{order.shippingAddress.city}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedOrder(order)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 rounded-lg transition-all duration-200 font-bold text-white "
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            
            <button
              onClick={() => downloadOrderReceipt(order)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-700/70 hover:bg-green-800/90 text-white rounded-lg transition-colors font-bold "
            >
              <Download className="w-4 h-4" />
              <span>Receipt</span>
            </button>
            
            {order.orderStatus === 'pending' && (
              <button
                onClick={() => handleDelete(order._id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-700/70 hover:bg-red-800/90 text-red-400 rounded-lg transition-colors font-bold"
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
  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-green-600 ">
      <div className="sticky top-0 bg-gradient-to-r from-green-700 to-green-400 px-6 py-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white ">Order Details</h2>
          <button
            onClick={() => setSelectedOrder(null)}
            className="p-2 hover:bg-green-600/30 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6 text-white font-bold">
        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-green-400 mb-3 ">Order Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-green-500">Order Number:</span> <span className="text-white font-extrabold">{selectedOrder.orderNumber}</span></p>
              <p><span className="text-green-500">Status:</span> 
                <span className={`ml-2 inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.orderStatus)} `}>
                  {getStatusIcon(selectedOrder.orderStatus)}
                  <span className="capitalize">{selectedOrder.orderStatus}</span>
                </span>
              </p>
              <p><span className="text-green-500">Payment Status:</span> <span className="text-white font-extrabold capitalize">{selectedOrder.paymentStatus}</span></p>
              <p><span className="text-green-500">Total Amount:</span> <span className="text-white font-extrabold">₹{selectedOrder.totalAmount}</span></p>
              <p><span className="text-green-500">Order Date:</span> <span className="text-white font-extrabold">{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
              {selectedOrder.trackingNumber && (
                <p><span className="text-green-500">Tracking Number:</span> <span className="text-white font-extrabold">{selectedOrder.trackingNumber}</span></p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-green-400 mb-3 ">Shipping Address</h3>
            <div className="bg-black/90 rounded-lg p-4 border border-green-600 ">
              <div className="space-y-1 text-sm">
                <p className="text-green-400 font-extrabold">{selectedOrder.shippingAddress.name}</p>
                <p className="text-white">{selectedOrder.shippingAddress.address}</p>
                <p className="text-white">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.district}</p>
                <p className="text-white">{selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                <p className="text-white">📞 {selectedOrder.shippingAddress.contactNumber}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div>
          <h3 className="text-lg font-extrabold text-green-400 mb-4">Order Items ({selectedOrder.items.length})</h3>
          <div className="space-y-3">
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="bg-black/90 rounded-lg p-4 border border-green-600 ">
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-green-500" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-green-400 font-bold">{item.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                      <p><span className="text-green-500">Type:</span> <span className="text-white">{item.type}</span></p>
                      <p><span className="text-green-500">Size:</span> <span className="text-white">{item.size}</span></p>
                      <p><span className="text-green-500">Quantity:</span> <span className="text-white">{item.quantity}</span></p>
                      <p><span className="text-green-500">Price:</span> <span className="text-white">₹{item.price}</span></p>
                    </div>
                    {item.isFullSleeve && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-700 text-green-300 text-xs rounded-full font-bold">Full Sleeve</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-extrabold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Notes */}
        {selectedOrder.notes && (
          <div>
            <h3 className="text-lg font-extrabold text-green-400 mb-2 ">Order Notes</h3>
            <div className="bg-black/90 rounded-lg p-4 border border-green-600">
              <p className="text-white font-bold">{selectedOrder.notes}</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-green-600">
          <button
            onClick={() => downloadOrderReceipt(selectedOrder)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 rounded-lg transition-all duration-200 font-bold text-white"
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 rounded-lg transition-all duration-200 font-bold text-red-400 "
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
    </div> {/* end of max-w-7xl container */}
  </div>  
);
}

export default Dashboard;