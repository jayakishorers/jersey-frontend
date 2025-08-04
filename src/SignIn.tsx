import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';


const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signin',
        formData
      );

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      navigate('/dashboard');
      window.location.reload();
    } catch (err: any) {
      const msg =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.msg ||
      'Login failed';
      setError(msg);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);
  
  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: "url('/bg-img.jpg')" }}
    >
      <div className="bg-black/70 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Sign In</h2>

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
            required
            className="w-full p-3 bg-gray-800 rounded text-white placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-800 rounded text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-2 rounded"
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
      </div>
    </div>
  );
};

export default SignIn;
