import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://jerseybackend.onrender.com/api/auth/signin',
        formData
      );

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      navigate('/dashboard');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-img.jpg')" }}
    >
      <div className="bg-black/70 p-8 rounded-lg shadow-lg w-full max-w-md text-white backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Sign In</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-green-400 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
              />
            </svg>
            <p className="text-green-300 text-sm">Signing you in...</p>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full p-3 bg-gray-800 rounded text-white placeholder-gray-400 disabled:opacity-50"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full p-3 bg-gray-800 rounded text-white placeholder-gray-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-2 rounded disabled:opacity-50"
              >
                Sign In
              </button>
            </form>

            <p className="mt-4 text-center text-sm">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-green-400 hover:underline">
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
