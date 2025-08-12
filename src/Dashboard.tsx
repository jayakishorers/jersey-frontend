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
    const res = await axios.get('/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 1, limit: 20 },
    });
    console.log('API response:', res.data); // 👈 Add this

    if (res.data.success) {
      setOrders(res.data.data.orders);
      setError(null);
    } else {
      setError('Failed to load orders');
    }
  } catch (err) {
    console.error('Fetch error:', err); // 👈 Add this
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
      await axios.delete(`/api/orders/${id}`, {
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

          {/* Orders Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
            {loading && <p>Loading orders...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && orders.length === 0 && <p>No orders found.</p>}

            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <p>
                      <strong>Order #: </strong> {order.orderNumber}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span
                        className={
                          order.orderStatus === 'delivered'
                            ? 'text-green-400'
                            : order.orderStatus === 'cancelled'
                            ? 'text-red-500'
                            : 'text-yellow-400'
                        }
                      >
                        {order.orderStatus}
                      </span>
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Items:</strong> {order.items.length}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Ordered on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold self-start md:self-auto"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
