import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // ✅ Replace with your actual admin email or role check
        if (user.email === 'admin@example.com') {
          setIsAdmin(true);
        } else {
          navigate('/dashboard'); // Not an admin
        }
      } catch (err) {
        navigate('/signin'); // Invalid user data
      }
    } else {
      navigate('/signin'); // No token/user
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking access...
      </div>
    );
  }

  return isAdmin ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-400">Admin Dashboard</h1>
        <p className="text-lg">Welcome, Admin! This is your protected area.</p>
      </div>
    </div>
  ) : null;
};

export default AdminPage;
