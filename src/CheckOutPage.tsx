import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CartItem } from './types'; // Adjust the import path if needed

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

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const validateField = (field: string) => {
    return touched[field] && !formData[field as keyof typeof formData];
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to place an order.');
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
      const res = await axios.post(
        'http://localhost:5000/api/orders/create',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        });
        setTouched({});
      } else {
        toast.error('Failed to place order.');
      }
    } catch (err: any) {
      console.error(err.response || err);
      toast.error(
        err?.response?.data?.message ||
          'Something went wrong while placing the order.'
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid grid-cols-1 gap-6">
        {[
          { name: 'name', label: 'Full Name' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'contactNumber', label: 'Contact Number' },
          { name: 'address', label: 'Street Address' },
          { name: 'city', label: 'City' },
          { name: 'district', label: 'District' },
          { name: 'state', label: 'State' },
          { name: 'pincode', label: 'Pincode' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <input
              name={name}
              type={type || 'text'}
              placeholder={label}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, [name]: true })}
              className={`border p-3 rounded w-full text-black ${
                validateField(name) ? 'border-red-500' : ''
              }`}
            />
            {validateField(name) && (
              <p className="text-red-500 text-sm mt-1">
                Please enter your {label.toLowerCase()}.
              </p>
            )}
          </div>
        ))}

        <textarea
          name="notes"
          placeholder="Order Notes (Optional)"
          value={formData.notes}
          onChange={handleChange}
          className="border p-3 rounded w-full text-black"
        ></textarea>

        <div className="text-xl font-semibold">
          Total Amount: ₹{cartTotal}
        </div>

        <button
          onClick={handleOrder}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
