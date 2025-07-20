import React from 'react';
import { Link } from 'react-router-dom';

const SignIn: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg-img.jpg')", // image from public folder
      }}
    >
      <div className="bg-black/70 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Sign In</h2>
        
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-800 rounded text-white placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
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
