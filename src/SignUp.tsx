import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default browser page reload

    setError('');

    try {
      const response = await axios.post(
        'https://jerseybackend.onrender.com/api/auth/signup',
        formData
      );

      // Save token locally (optional, depends on your flow)
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      // Redirect after successful signup
      navigate('/dashboard'); // or '/signin' if you prefer login first
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg-img.jpg')" // Ensure this file exists in /public
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-2xl w-full max-w-md text-white backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-green-400 tracking-wide">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition-all text-white font-semibold py-2 rounded shadow-md"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/signin" className="text-green-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
