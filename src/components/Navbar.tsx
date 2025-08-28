import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Heart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartDrawer } from './CartDrawer';
import { CartItem } from '../types';

interface NavbarProps {
  cartCount: number;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  cartTotal: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  cartTotal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center space-x-3 cursor-pointer"
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img
                src="/logo.png"
                alt="Chennaiyin Logo"
                className="h-10 w-auto object-contain"
              />
              <h1 className="text-xl font-bold ">
                CHENNAIYIN JERSEY
              </h1>
            </motion.div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-300 hover:text-white bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600 hover:border-green-500 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-300 hover:text-white bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600 hover:border-blue-500 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const token = localStorage.getItem('token');
                  navigate(token ? '/dashboard' : '/signin');
                }}
                className="p-2 text-gray-300 hover:text-white bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600 hover:border-yellow-500 transition-colors"
              >
                <User className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-300 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Solid background so no transparency issue */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              className="absolute top-0 right-0 w-full h-full bg-gray-900 shadow-xl flex flex-col"
            >
              {/* Close Button */}
              <div className="flex justify-end p-4 border-b border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Menu Items with animation */}
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="flex flex-col p-6 gap-6 text-gray-300 text-lg"
              >
                <motion.li whileTap={{ scale: 0.95 }} className="flex items-center space-x-3 hover:text-white">
                  <Heart className="h-6 w-6" />
                  <span>Wishlist</span>
                </motion.li>

                <motion.li
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 hover:text-white relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute left-20 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </motion.li>

                <motion.li
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    navigate(token ? '/dashboard' : '/signin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 hover:text-white"
                >
                  <User className="h-6 w-6" />
                  <span>Profile</span>
                </motion.li>
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        cartTotal={cartTotal}
      />
    </>
  );
};
