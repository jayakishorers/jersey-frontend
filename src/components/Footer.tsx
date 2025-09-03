import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Instagram, Mail, Phone, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';

interface FooterProps {
  cartCount: number;
  cartItems: CartItem[];
  onOpenCart: () => void; // handler to open cart drawer
}

const categories = [
  'New Arrivals',
  'Best Sellers',
  'Country Jerseys',
  'Club Jerseys',
  'Trending',
  'Retro Collection',
  'Full Kit',
  'Master Copy',
  'Sublimation'
];

const Footer: React.FC<FooterProps> = ({ cartCount, cartItems, onOpenCart }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
              Chennaiyin Jersey
            </h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Your premier destination for authentic football jerseys from the world's greatest teams.
            </p>
            <div className="flex space-x-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://maps.app.goo.gl/ZNYBHUkeTwLW8uSt8"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:text-white hover:bg-blue-600 transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/chennaiyinjersey?igsh=YnZjdGI3NDB6Y2kx"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:text-white hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/9445086680"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:text-white hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:chennaiyinjersey@gmail.com"
                className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:text-white hover:bg-red-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <motion.a whileHover={{ x: 5 }} href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Home
                </motion.a>
              </li>
              <li>
                <motion.a whileHover={{ x: 5 }} href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Dashboard
                </motion.a>
              </li>
              <li>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={onOpenCart} // open cart drawer
                  className="text-gray-300 hover:text-blue-400 transition-colors text-left"
                >
                  Cart
                </motion.button>
              </li>
              <li>
                <motion.a whileHover={{ x: 5 }} href="/signin" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Sign In
                </motion.a>
              </li>
              <li>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => setIsAboutOpen(true)}
                  className="text-gray-300 hover:text-blue-400 transition-colors text-left"
                >
                  About Us
                </motion.button>
              </li>
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.map(category => (
                <li key={category}>
                  <motion.a whileHover={{ x: 5 }} href={`#${category.toLowerCase().replace(/\s/g, '-')}`} className="text-gray-300 hover:text-green-400 transition-colors">
                    {category}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>chennaiyinjersey@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>9445086680, 9087035955</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>5/11, Middle street, Valinokkam, Ramanathapuram</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs"
        >
          <p>© 2024 Chennaiyin Jersey. All rights reserved.</p>
          
        </motion.div>
      </div>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-xl shadow-lg max-w-lg p-8 text-white relative"
          >
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">About Chennaiyin Jersey</h3>
            <p className="text-gray-300 mb-3 text-sm">
              Chennaiyin Jersey is your go-to destination for authentic football jerseys.
            </p>
          </motion.div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
