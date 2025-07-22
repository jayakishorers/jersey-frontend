import React from 'react';
import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-4">
              JerseyPro
            </h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Your premier destination for authentic football jerseys from the
              world's greatest teams and players.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="p-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 hover:text-white hover:bg-blue-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Shop', 'Customize', 'About Us', 'Contact', 'Size Guide'].map(link => (
                <li key={link}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {['Club Jerseys', 'National Teams', 'Retro Collection', 'Full Kits', 'Player Edition', 'Custom Jerseys'].map(category => (
                <li key={category}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    {category}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h4>
            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>info@jerseypro.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>123 Sports Ave, City, State</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-gray-900 font-semibold mb-2">Newsletter</h5>
              <p className="text-gray-500 text-sm mb-3">
                Get the latest updates and exclusive offers
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-r-lg hover:bg-blue-700 transition-all"
                >
                  Subscribe
                </motion.button>
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
          className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 text-xs">
            © 2024 JerseyPro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-xs">
            <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">
              Return Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
