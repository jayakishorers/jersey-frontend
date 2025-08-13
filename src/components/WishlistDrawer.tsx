import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { Jersey } from '../types'; // Adjust path as needed

interface WishListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedItems: Jersey[];
  onAddToCart: (jersey: Jersey, size: string, quantity: number) => void;
}

export const WishListDrawer: React.FC<WishListDrawerProps> = ({
  isOpen,
  onClose,
  wishlistedItems,
  onAddToCart
}) => {
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
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full max-w-md bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <span>Wishlist</span>
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
              <p className="text-gray-400 mt-1">{wishlistedItems.length} items</p>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 p-6">
              {wishlistedItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-400 mb-6">Explore jerseys to add them here!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-lg font-semibold"
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistedItems.map((jersey) => (
                    <motion.div
                      key={jersey.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={jersey.image}
                          alt={jersey.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm mb-1">
                            {jersey.name}
                          </h3>
                          <p className="text-gray-400 text-xs mb-2">{jersey.club}</p>
                          <span className="text-green-400 font-semibold">
                            Rs{jersey.price}
                          </span>

                          {/* Add to Cart Button */}
                          <div className="mt-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onAddToCart(jersey, 'M', 1)} // default size & quantity
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
