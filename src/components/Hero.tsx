import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Search } from 'lucide-react';

interface HeroProps {
  onShopNowClick: () => void;
  onCustomizeClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNowClick, onCustomizeClick }) => {
  return (
    <section className="relative min-h-screen pt-20 sm:pt-24 flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-200 opacity-90 z-0" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="flex items-center justify-center gap-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-center">
            <motion.img
              src="/logo.png"
              alt="Chennaiyin Logo"
              className="h-[6.5rem] md:h-[8rem] w-auto object-contain drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="flex flex-col items-center leading-tight font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow">
                CHENNAIYIN
              </span>
              <span className="text-gray-800 text-3xl sm:text-4xl">JERSEYS</span>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Discover premium football jerseys from the world's greatest teams. Authentic designs, superior quality,
            unmatched passion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShopNowClick}
              className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              <div className="relative flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Shop Now</span>
              </div>
            </motion.button>

            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4"
          >
            {[ 
              { icon: Star, label: 'Happy Customers', value: '500K+' },
              { icon: ShoppingBag, label: 'Premium Jerseys', value: '1000+' },
              { icon: Star, label: 'Global Teams', value: '200+' },
              { icon: ShoppingBag, label: 'Years of Trust', value: '10+' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-100 border border-gray-300 rounded-xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
