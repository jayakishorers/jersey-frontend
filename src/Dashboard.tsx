import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const wishCount = Array.isArray(wishlist) ? wishlist.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/60 backdrop-blur-md rounded-xl shadow-xl p-8 border border-gray-700">
          <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-6 text-center">
            Welcome, {user?.name || 'User'}!
          </h1>

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-800 border-2 border-green-500 rounded-full flex items-center justify-center text-3xl font-bold text-green-400 uppercase">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <p className="mt-3 text-gray-300">Your Profile</p>
            </div>

            {/* User Info */}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
