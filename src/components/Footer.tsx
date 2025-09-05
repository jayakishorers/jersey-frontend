import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Instagram, Mail, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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

const sizeChartImages = [
  "/fanvers.jpg",
  "/sublim.jpg",
  "/playervers.jpg"
];

const Footer: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sizeChartImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sizeChartImages.length) % sizeChartImages.length);

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
                href="https://maps.app.goo.gl/ZNYBHUkeTwLW8uSt8"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:text-white hover:bg-blue-600 transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.instagram.com/chennaiyinjersey"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:text-white hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://wa.me/9445086680"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:text-white hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
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
              <li><motion.a whileHover={{ x: 5 }} href="#" className="text-gray-300 hover:text-blue-400">Home</motion.a></li>
              <li><motion.a whileHover={{ x: 5 }} href="/dashboard" className="text-gray-300 hover:text-blue-400">Dashboard</motion.a></li>
              <li><motion.a whileHover={{ x: 5 }} href="#" className="text-gray-300 hover:text-blue-400">Cart</motion.a></li>
              <li><motion.a whileHover={{ x: 5 }} href="/signin" className="text-gray-300 hover:text-blue-400">Sign In</motion.a></li>
              <li>
                <motion.button whileHover={{ x: 5 }} onClick={() => setIsAboutOpen(true)} className="text-gray-300 hover:text-blue-400 text-left">
                  About Us
                </motion.button>
              </li>
              <li>
                <motion.button whileHover={{ x: 5 }} onClick={() => setIsShippingOpen(true)} className="text-gray-300 hover:text-blue-400 text-left">
                  Shipping & Delivery
                </motion.button>
              </li>
              <li>
                <motion.button whileHover={{ x: 5 }} onClick={() => setIsRefundOpen(true)} className="text-gray-300 hover:text-blue-400 text-left">
                  Return & Refund Policy
                </motion.button>
              </li>
              <li>
                <motion.button whileHover={{ x: 5 }} onClick={() => setIsSizeChartOpen(true)} className="text-gray-300 hover:text-blue-400 text-left">
                  Size Chart
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
                  <motion.a whileHover={{ x: 5 }} href={`#${category.toLowerCase().replace(/\s/g, '-')}`} className="text-gray-300 hover:text-green-400">
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
              <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-blue-400" /><span>chennaiyinjersey@gmail.com</span></div>
              <div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-blue-400" /><span>9445086680, 9087035955</span></div>
              <div className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-blue-400" /><span>5/11, Middle street, Valinokkam, Ramanathapuram</span></div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
          <p>© 2024 Chennaiyin Jersey. All rights reserved.</p>
        </motion.div>
      </div>

      {/* About Modal */}
      {isAboutOpen && (
        <Modal title="About Chennaiyin Jersey" onClose={() => setIsAboutOpen(false)}>
          <p>Chennaiyin Jersey is your go-to destination for authentic football jerseys.</p>
        </Modal>
      )}

      {/* Shipping & Delivery Modal */}
      {isShippingOpen && (
        <Modal title="Shipping & Delivery" onClose={() => setIsShippingOpen(false)}>
          <p><strong>Delivery Timeline:</strong> We strive to deliver your orders within 7 to 10 business days from the date of purchase. Orders placed on weekends or public holidays will be processed on the next working day. Delivery times may vary based on your location or unforeseen circumstances.</p>
          <p className="mt-2"><strong>Order Tracking:</strong> Once your order has been shipped, you'll receive a tracking number via email or SMS. You can use this tracking number to check the delivery status of your order.</p>
          <p className="mt-2"><strong>Undelivered Packages:</strong> If we are unable to deliver your order due to an incorrect address, unavailability, or other issues, our courier partner will attempt redelivery. If unsuccessful, the package will be returned to us. Please contact us to arrange a reshipment.</p>
        </Modal>
      )}

      {/* Return & Refund Modal */}
      {isRefundOpen && (
        <Modal title="Return & Refund Policy" onClose={() => setIsRefundOpen(false)}>
          <p>We accept returns or exchanges only in the following cases:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Wrong item sent</li>
            <li>Wrong size sent (different from what was ordered)</li>
            <li>Damaged item received</li>
          </ul>
          <p className="mt-2">In such cases, it is mandatory to provide:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>An unboxing video</li>
            <li>Clear photos of the item</li>
            <li>Original packaging and tags intact</li>
          </ul>
          <p className="mt-2">We do not accept returns or exchanges for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Sizing issues (please refer to the size chart before ordering)</li>
            <li>Customized or printed orders</li>
          </ul>
          <p className="mt-2">All refund and replacement-related communication is handled exclusively via WhatsApp.</p>
        </Modal>
      )}

      {/* Size Chart Modal with Slider + Zoom */}
{isSizeChartOpen && (
  <Modal title="Size Chart" onClose={() => setIsSizeChartOpen(false)}>
    <div className="relative flex items-center justify-center">
      <img
  src={sizeChartImages[currentSlide]}
  alt="Size Chart"
  className="w-full h-auto rounded-lg cursor-pointer"
  onClick={() => setIsZoomed(true)} // ✅ open fullscreen on click
/>

{isZoomed && (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    onClick={() => setIsZoomed(false)} // ✅ close fullscreen when clicking background
  >
    <img
      src={sizeChartImages[currentSlide]}
      alt="Zoomed Size Chart"
      className="max-w-full max-h-full object-contain"
    />
  </div>
)}

      <button onClick={prevSlide} className="absolute left-0 bg-black/50 p-2 rounded-full"><ChevronLeft className="w-6 h-6 text-white" /></button>
      <button onClick={nextSlide} className="absolute right-0 bg-black/50 p-2 rounded-full"><ChevronRight className="w-6 h-6 text-white" /></button>
    </div>
    <p className="text-center mt-2 text-sm text-gray-400">Slide {currentSlide + 1} of {sizeChartImages.length} — Click image to zoom</p>
  </Modal>
)}

    </footer>
  );
};

// Reusable Modal Component
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gray-800 rounded-xl shadow-lg max-w-lg p-8 text-white relative">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">✕</button>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="text-sm text-gray-300 space-y-2">{children}</div>
    </motion.div>
  </div>
);

export default Footer;
