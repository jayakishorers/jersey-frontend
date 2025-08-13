import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size: string;
  // add other fields if needed
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  items: OrderItem[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const wishCount = Array.isArray(wishlist) ? wishlist.length : 0;

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
const fetchOrders = async () => {
  setLoading(true);
  try {
    const res = await axios.get('https://jerseybackend.onrender.com/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 1, limit: 20 },
    });
    console.log('API response:', res.data);

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

    fetchOrders();
  }, [token, navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-black/60 backdrop-blur-md rounded-xl shadow-xl p-8 border border-gray-700">
          <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-6 text-center">
            Welcome, {user?.name || 'User'}!
          </h1>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-800 border-2 border-green-500 rounded-full flex items-center justify-center text-3xl font-bold text-green-400 uppercase">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <p className="mt-3 text-gray-300">Your Profile</p>
            </div>
            <div className="flex-1 space-y-2 text-lg">
              <p>
                <span className="text-gray-400">Email:</span>{' '}
                <span className="text-white font-medium">{user?.email || 'N/A'}</span>
              </p>
              {user?.phone && (
                <p>
                  <span className="text-gray-400">Phone:</span>{' '}
                  <span className="text-white font-medium">{user.phone}</span>
                </p>
              )}
              <p>
                <span className="text-gray-400">Wishlist Items:</span>{' '}
                <span className="text-white font-semibold">{wishCount}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white font-semibold transition"
            >
              Logout
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-semibold transition"
            >
              Back to Home
            </button>
          </div>
          {loading && <p className="mt-6 text-center text-gray-400">Loading orders...</p>}

{error && <p className="mt-6 text-center text-red-500">{error}</p>}

{!loading && !error && orders.length === 0 && (
  <p className="mt-6 text-center text-gray-400">You have no orders yet.</p>
)}

{!loading && !error && orders.length > 0 && (
  <div className="mt-8 space-y-6">
    <h2 className="text-2xl font-semibold text-green-400 mb-4">Your Orders</h2>
    {orders.map(order => (
      <div key={order._id} className="bg-gray-800 rounded p-4 border border-gray-700">
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
        <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

        <details className="mt-2">
          <summary className="cursor-pointer text-green-400 font-semibold">View Items ({order.items.length})</summary>
          <ul className="mt-2 list-disc list-inside">
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.name} — Size: {item.size} — Qty: {item.quantity} — ₹{item.price}
              </li>
            ))}
          </ul>
        </details>

        <button
          onClick={() => handleDelete(order._id)}
          className="mt-3 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
        >
          Delete Order
        </button>
      </div>
    ))}
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
