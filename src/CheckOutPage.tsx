import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartItem } from './types';
import { useState, useEffect } from "react";
import { ShoppingBag, User, Mail, Phone, MapPin, FileText, Truck } from 'lucide-react';
import { calculateDeliveryCharges } from './utils/deliveryCharges';

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
    postOffice: '',
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

  const getFieldError = (field: string) => {
    const value = formData[field as keyof typeof formData];
    
    // Only show an error if the field has been touched
    if (!touched[field]) {
      return '';
    }
    
    if (field === 'name') {
      if (!value) {
        return 'Please enter your full name.';
      }
      if (!/^[A-Za-z\s]{3,50}$/.test(value)) {
        return 'Name should contain only letters & spaces (min 3 chars).';
      }
    }

    if (field === 'email') {
      const strongEmailRegex = /^[^\s@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!value) {
        return 'Please enter your email address.';
      }
      if (!strongEmailRegex.test(value) || /\.comm$/i.test(value)) {
        return "Please enter a valid email address (e.g., did you mean '.com'?).";
      }
    }

    if (field === 'contactNumber') {
      if (!value) {
        return 'Please enter your contact number.';
      }
      if (value.length !== 10) {
        return 'Contact number must be exactly 10 digits.';
      }
    }
    
    if (field === 'address') {
      if (!value) {
        return 'Please enter your street address.';
      }
      if (value.trim().length < 5) {
        return 'Address must be at least 5 characters long.';
      }
    }
    
    if (field === 'city' || field === 'district' || field === 'state') {
      if (!value) {
        return `Please enter your ${field}.`;
      }
      if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
        return `${field} should contain only letters (min 2 chars).`;
      }
    }

    if (field === 'postOffice') {
      // Optional field - only validate format if value is provided
      if (value && !/^[A-Za-z\s]{2,50}$/.test(value)) {
        return 'Post office should contain only letters (min 2 chars).';
      }
    }

    if (field === 'pincode') {
      if (!value) {
        return 'Please enter your pincode.';
      }
      if (value.length !== 6) {
        return 'Pincode must be exactly 6 digits.';
      }
    }
    
    return '';
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem("checkoutForm", JSON.stringify(formData));
      navigate('/signin', {
        state: {
          from: location.pathname,
          message: 'Please sign in to proceed with your order.',
        },
      });
      return;
    }

    // Set all fields as touched to trigger validation messages on submit
    setTouched({
      name: true,
      email: true,
      address: true,
      city: true,
      district: true,
      state: true,
      pincode: true,
      contactNumber: true,
      notes: true,
      postOffice: true,
    });

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

    const validationErrors = requiredFields.some(field => getFieldError(field));

    if (validationErrors) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    const sanitizedNotes = formData.notes.replace(/<[^>]*>?/gm, "");

    const deliveryCharges = calculateDeliveryCharges(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    const finalTotal = cartTotal + deliveryCharges;

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
      totalAmount: finalTotal,
      shippingAddress: {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        ...(formData.postOffice && { postOffice: formData.postOffice }),
      },
      paymentMethod: 'cash_on_delivery',
      notes: sanitizedNotes,
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
          postOffice: '',
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

  const getInputFieldClass = (field: string) => {
    const error = getFieldError(field);
    return `w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
      error ? 'border-red-300 ring-red-200' : 'border-gray-200'
    }`;
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
                  className={getInputFieldClass('name')}
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
                  className={getInputFieldClass('email')}
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
                  className={getInputFieldClass('contactNumber')}
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
                  House.no,  Street Address *
                </label>
                <input
                  name="address"
                  type="text"
                  placeholder="Enter your street address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, address: true })}
                  className={getInputFieldClass('address')}
                />
                {getFieldError('address') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('address')}</p>
                )}
              </div>

              {/* Responsive layout for address sub-fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={getInputFieldClass('city')}
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
                    className={getInputFieldClass('district')}
                  />
                  {getFieldError('district') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('district')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Office
                  </label>
                  <input
                    name="postOffice"
                    type="text"
                    placeholder="Post Office"
                    value={formData.postOffice}
                    onChange={handleChange}
                    onBlur={() => setTouched({ ...touched, postOffice: true })}
                    className={getInputFieldClass('postOffice')}
                  />
                  {getFieldError('postOffice') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('postOffice')}</p>
                  )}
                </div>

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
                    className={getInputFieldClass('state')}
                  />
                  {getFieldError('state') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('state')}</p>
                  )}
                </div>
              </div>

              {/* Pincode field is placed outside the grid for better alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode/Zipcode *
                </label>
                <input
                  name="pincode"
                  type="text"
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  onBlur={() => setTouched({ ...touched, pincode: true })}
                  maxLength={6}
                  className={getInputFieldClass('pincode')}
                />
                {getFieldError('pincode') && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError('pincode')}</p>
                )}
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
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">₹{cartTotal}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Delivery Charges:</span>
                </div>
                <span className="font-semibold text-blue-600">₹{calculateDeliveryCharges(cartItems.reduce((sum, item) => sum + item.quantity, 0))}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center text-2xl font-bold text-gray-800">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{cartTotal + calculateDeliveryCharges(cartItems.reduce((sum, item) => sum + item.quantity, 0))}</span>
              </div>
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
                  Place Order - ₹{cartTotal + calculateDeliveryCharges(cartItems.reduce((sum, item) => sum + item.quantity, 0))}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 transform">
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