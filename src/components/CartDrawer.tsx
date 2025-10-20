import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { calculateDeliveryCharges } from '../utils/deliveryCharges';


interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number, maxStock?: number) => void;
  onRemoveItem: (itemId: string) => void;
  cartTotal: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  cartTotal,
}) => {
  const { setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('⚠️ Please sign in to proceed with checkout.');
      setTimeout(() => {
        onClose();
        navigate('/signin', { state: { from: '/checkout' } }); // redirect back after login
      }, 1200);
      return;
    }
    // already logged in
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900/95 backdrop-blur-md border-l border-gray-700/50 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <ShoppingBag className="w-6 h-6" />
                  <span>Shopping Cart</span>
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              <p className="text-gray-400 mt-1">{cartItems.length} items</p>
            </div>

            {/* Cart Items */}
            <div className="flex-1 p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6">Add some jerseys to get started!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold"
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={item.jersey.image}
                          alt={item.jersey.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm mb-1">
                            {item.jersey.name}
                          </h3>
                          <p className="text-gray-400 text-xs mb-2">{item.jersey.club}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                              Size: {item.size}
                            </span>
                            <span className="text-blue-400 font-semibold">
                              ₹{item.jersey.price}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  const maxStock = item.jersey.stockBySize?.[item.size] ?? 999;
                                  onUpdateQuantity(item.id, item.quantity - 1, maxStock);
                                }}
                                className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <span className="text-white font-semibold min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  const maxStock = item.jersey.stockBySize?.[item.size] ?? 999;
                                  if (item.quantity < maxStock) {
                                    onUpdateQuantity(item.id, item.quantity + 1, maxStock);
                                  }
                                }}
                                disabled={item.quantity >= (item.jersey.stockBySize?.[item.size] ?? 999)}
                                className={`p-1 rounded transition-colors ${
                                  item.quantity >= (item.jersey.stockBySize?.[item.size] ?? 999)
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>
                            
                            {/* Stock warning */}
                            {item.jersey.stockBySize?.[item.size] && item.quantity >= item.jersey.stockBySize[item.size] && (
                              <span className="text-xs text-orange-400">Max stock</span>
                            )}
                            
                            {/* Low stock warning */}
                            {item.jersey.stockBySize?.[item.size] && item.jersey.stockBySize[item.size] <= 3 && (
                              <span className="text-xs text-orange-400">{item.jersey.stockBySize[item.size]} left</span>
                            )}


                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-800 space-y-4">
                {authError && (
                  <div className="p-3 bg-red-500/20 border border-red-400 rounded-lg text-red-300 text-sm text-center">
                    {authError}
                  </div>
                )}

                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="text-white font-bold">₹{cartTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">Delivery Charges:</span>
                  </div>
                  <span className="text-blue-400">₹{calculateDeliveryCharges(cartItems.reduce((sum, item) => sum + item.quantity, 0))}</span>
                </div>

                <div className="flex justify-between items-center text-xl font-bold border-t border-gray-700 pt-4">
                  <span className="text-white">Total:</span>
                  <span className="text-white">₹{(cartTotal + calculateDeliveryCharges(cartItems.reduce((sum, item) => sum + item.quantity, 0))).toFixed(2)}</span>
                </div>

                {/* ✅ Authenticated checkout handling */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl text-lg text-center hover:shadow-lg hover:shadow-green-500/30 transition-all"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  Continue Shopping
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
