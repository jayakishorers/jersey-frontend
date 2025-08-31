import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Strong Email Validation
  const validateEmail = (email: string) => {
    const basic = /^[^\s@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!basic.test(email)) return false;

    const [local, domain] = email.split('@');
    if (!local || !domain) return false;

    // No consecutive dots
    if (/\.\./.test(local) || /\.\./.test(domain)) return false;

    // Domain checks
    const parts = domain.split('.');
    if (parts.some(p => p.length === 0 || p.startsWith('-') || p.endsWith('-'))) return false;

    // Block common typo `.comm`
    if (/\.comm$/i.test(domain)) return false;

    return true;
  };

  // ✅ Phone Validation: exactly 10 digits, not all same digit
  const validatePhone = (phone: string) =>
    /^\d{10}$/.test(phone) && !/^(\d)\1{9}$/.test(phone);

  const validateForm = () => {
    const errors: any = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      errors.email = "Enter a valid email (did you mean '.com' instead of '.comm'?).";
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Enter a valid 10-digit phone number.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Only allow digits, max length 10
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: phoneValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear field-specific error as user types
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        'https://jerseybackend.onrender.com/api/auth/signup',
        formData
      );

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      navigate('/dashboard');
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Signup failed. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Join Us Today</h2>
          <p className="text-blue-100">Create your account to get started</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-900 text-sm text-center">{apiError}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Creating your account...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 pr-10 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                Create Account
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
