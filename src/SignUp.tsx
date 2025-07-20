import React from 'react';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg-img.jpg')", // Or use bg-img.png if that's the extension
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-2xl w-full max-w-md text-white backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-green-400 tracking-wide">
          Create Your Account
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-3 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
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
