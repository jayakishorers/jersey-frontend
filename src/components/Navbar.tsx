import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Menu, X, ShoppingCart, Heart, User, Palette } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  cartCount: number;
  onCartClick: () => void;
  onSearchClick: () => void;
  onCustomizeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  cartCount,
  onCartClick,
  onSearchClick,
  onCustomizeClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
            className="flex-shrink-0"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              CHENNAIYIN JERSEYS
            </h1>
          </motion.div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onClick={onSearchClick}
                placeholder="Search jerseys..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCustomizeClick}
              className="p-2 text-gray-300 hover:text-white bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600 hover:border-purple-500 transition-colors"
            >
              <Palette className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFilterToggle}
              className="p-2 text-gray-300 hover:text-white bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600 hover:border-blue-500 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </motion.button>
            
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
              onClick={onCartClick}
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
              className="p-2 text-gray-300 hover:text-white bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-600 hover:border-yellow-500 transition-colors"
            >
              <User className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-700"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onClick={onSearchClick}
                    placeholder="Search jerseys..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-around">
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onFilterToggle}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white"
                  >
                    <Filter className="h-5 w-5" />
                    <span>Filter</span>
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onCartClick}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 left-6 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};