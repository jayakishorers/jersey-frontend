import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartItem } from './types';
import { useState, useEffect } from "react";
import { ShoppingBag, User, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: CartItem[];
  cartTotal: number;
  onClearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  cartTotal,
  onClearCart,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    contactNumber: '',
    notes: '',
  });

  // Load saved form data on component mount
  useEffect(() => {
    const saved = localStorage.getItem("checkoutForm");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(formData));
  }, [formData]);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Enhanced validation for phone number
    if (name === 'contactNumber') {
      // Only allow digits and limit to 10 characters
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: phoneValue });
    } else if (name === 'pincode') {
      // Only allow digits and limit to 6 characters
      const pincodeValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData({ ...formData, [name]: pincodeValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setTouched({ ...touched, [name]: true });
  };

  const validateField = (field: string) => {
    const value = formData[field as keyof typeof formData];
    
    if (!value) return touched[field];
    
    // Additional validation for specific fields
    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return touched[field] && !emailRegex.test(value);
    }
    
    if (field === 'contactNumber' && value) {
      return touched[field] && value.length !== 10;
    }
    
    if (field === 'pincode' && value) {
      return touched[field] && value.length !== 6;
    }
    
    return false;
  };

  const getFieldError = (field: string) => {
    const value = formData[field as keyof typeof formData];
    
    if (!value && touched[field]) {
      return `Please enter your ${field === 'contactNumber' ? 'contact number' : field}.`;
    }
    
    if (field === 'email' && value && touched[field]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address.';
      }
    }
    
    if (field === 'contactNumber' && value && touched[field]) {
      if (value.length !== 10) {
        return 'Contact number must be exactly 10 digits.';
      }
    }
    
    if (field === 'pincode' && value && touched[field]) {
      if (value.length !== 6) {
        return 'Pincode must be exactly 6 digits.';
      }
    }
    
    return '';
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Save current form data before redirecting
      localStorage.setItem("checkoutForm", JSON.stringify(formData));
      
      navigate('/signin', {
        state: {
          from: location.pathname,
          message: 'Please sign in to proceed with your order.',
        },
      });
      return;
    }

    const requiredFields = [
      'name',
      'email',
      'address',
      'city',
      'district',
      'state',
      'pincode',
      'contactNumber',
    ];

    const missingFields = requiredFields.filter(
      (key) => !formData[key as keyof typeof formData]
    );

    // Validate email format
    // Stronger email regex: prevents ".comm", double dots, invalid TLDs
const strongEmailRegex = /^[^\s@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
if (!strongEmailRegex.test(formData.email) || /\.comm$/i.test(formData.email)) {
  toast.error("Invalid email. Did you mean '.com'?");
  setTouched({ ...touched, email: true });
  return;
}

// Name validation: alphabets & spaces only, min 3 chars
if (!/^[A-Za-z\s]{3,50}$/.test(formData.name)) {
  toast.error("Name should contain only letters & spaces (min 3 chars).");
  setTouched({ ...touched, name: true });
  return;
}

// City/District/State validation: alphabets & spaces only
["city", "district", "state"].forEach((field) => {
  const val = formData[field as keyof typeof formData];
  if (!/^[A-Za-z\s]{2,50}$/.test(val)) {
    toast.error(`${field} should contain only letters (min 2 chars).`);
    setTouched({ ...touched, [field]: true });
    throw new Error("Validation failed");
  }
});

// Address validation: min length
if (formData.address.trim().length < 5) {
  toast.error("Address must be at least 5 characters long.");
  setTouched({ ...touched, address: true });
  return;
}

// Sanitize Notes: strip dangerous tags
const sanitizedNotes = formData.notes.replace(/<[^>]*>?/gm, "");

    // Validate phone number
    if (formData.contactNumber && formData.contactNumber.length !== 10) {
      toast.error('Contact number must be exactly 10 digits.');
      setTouched({ ...touched, contactNumber: true });
      return;
    }

    // Validate pincode
    if (formData.pincode && formData.pincode.length !== 6) {
      toast.error('Pincode must be exactly 6 digits.');
      setTouched({ ...touched, pincode: true });
      return;
    }

    if (missingFields.length > 0) {
      toast.error('Please fill all required fields.');
      setTouched((prev) => {
        const updated = { ...prev };
        missingFields.forEach((field) => {
          updated[field] = true;
        });
        return updated;
      });
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item.jersey.id,
        isFullSleeve: item.jersey.isFullSleeve ?? false,
        type: item.jersey.type,
        name: item.jersey.name,
        size: item.size,
        quantity: item.quantity,
        price: item.jersey.price,
        image: item.jersey.image || '',
      })),
      totalAmount: cartTotal,
      shippingAddress: {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
      },
      paymentMethod: 'cash_on_delivery',
      notes: formData.notes || '',
    };

    try {
      setLoading(true);
      const res = await axios.post(
        'https://jerseybackend.onrender.com/api/orders/create',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      if (res.data.success) {
        toast.success(
          'Thank you for your order! Our executive will call you shortly regarding your transaction.'
        );
        onClearCart();

        // Clear form + localStorage after success
        setFormData({
          name: '',
          email: '',
          address: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
          contactNumber: '',
          notes: '',
        });
        localStorage.removeItem("checkoutForm");

        setTouched({});
        setShowSuccessModal(true);
      } else {
        toast.error('Failed to place order.');
      }
    } catch (err: any) {
      setLoading(false);
      console.error(err.response || err);
      toast.error(
        err?.response?.data?.message ||
          'Something went wrong while placing the order.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order details below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className={`w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    validateField('name') || getFieldError('name') ? 'border-red-300 ring-red-200' : 'border-gray-200'
                  }`}
                />
                {getFieldError('name') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    validateField('email') || getFieldError('email') ? 'border-red-300 ring-red-200' : 'border-gray-200'
                  }`}
                />
                {getFieldError('email') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Contact Number *
                </label>
                <input
                  name="contactNumber"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, contactNumber: true })}
                  maxLength={10}
                  className={`w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    validateField('contactNumber') || getFieldError('contactNumber') ? 'border-red-300 ring-red-200' : 'border-gray-200'
                  }`}
                />
                {getFieldError('contactNumber') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('contactNumber')}</p>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  name="address"
                  type="text"
                  placeholder="Enter your street address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, address: true })}
                  className={`w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    validateField('address') || getFieldError('address') ? 'border-red-300 ring-red-200' : 'border-gray-200'
                  }`}
                />
                {getFieldError('address') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('address')}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    name="city"
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={() => setTouched({ ...touched, city: true })}
                    className={`w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      validateField('city') || getFieldError('city') ? 'border-red-300 ring-red-200' : 'border-gray-200'
                    }`}
                  />
                  {getFieldError('city') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('city')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    name="district"
                    type="text"
                    placeholder="District"
                    value={formData.district}
                    onChange={handleChange}
                    onBlur={() => setTouched({ ...touched, district: true })}
                    className={`w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      validateField('district') || getFieldError('district') ? 'border-red-300 ring-red-200' : 'border-gray-200'
                    }`}
                  />
                  {getFieldError('district') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('district')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    name="state"
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={() => setTouched({ ...touched, state: true })}
                    className={`w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      validateField('state') || getFieldError('state') ? 'border-red-300 ring-red-200' : 'border-gray-200'
                    }`}
                  />
                  {getFieldError('state') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('state')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    name="pincode"
                    type="text"
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    onBlur={() => setTouched({ ...touched, pincode: true })}
                    maxLength={6}
                    className={`w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      validateField('pincode') || getFieldError('pincode') ? 'border-red-300 ring-red-200' : 'border-gray-200'
                    }`}
                  />
                  {getFieldError('pincode') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('pincode')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Order Notes (Optional)
            </label>
            <textarea
              name="notes"
              placeholder="Any special instructions for your order..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Order Summary */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="flex justify-between items-center text-2xl font-bold text-gray-800">
              <span>Total Amount:</span>
              <span className="text-blue-600">₹{cartTotal}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Cash on Delivery</p>
          </div>

          {/* Place Order Button */}
          <div className="mt-8">
            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Processing Order...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Place Order - ₹{cartTotal}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 transform animate-pulse">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Thank you for your order! Our executive will call you shortly
                regarding your transaction and delivery details.
              </p>
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => {
                  setShowSuccessModal(false);
                  window.location.href = '/';
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;