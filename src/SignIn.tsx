  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import axios from 'axios';

  const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
const [justSignedIn, setJustSignedIn] = useState(false); // Add this line


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

        const { token, user } = response.data.data;

        localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

setJustSignedIn(true); // Add this line before navigation

if (user.email === '123@gmail.com') {
  navigate('/admin');
} else {
  navigate('/dashboard');
}

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

    // PREVENT FLICKER - check token + user before rendering
    useEffect(() => {
  if (justSignedIn) return; // Skip auth check if just signed in

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      if (user.email === '123@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      return;
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  setCheckingAuth(false);
}, [navigate, justSignedIn]);  // add justSignedIn to dependency array


    if (checkingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <p>Checking authentication...</p>
        </div>
      );
    }

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
