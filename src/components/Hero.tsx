import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface HeroProps {
  onShopNowClick: () => void;
  onCustomizeClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNowClick }) => {
  return (
    <section className="relative min-h-[60vh] pt-16 flex items-center justify-center bg-white overflow-hidden">
      {/* Animated Soft Gradient Blobs */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-[50vw] h-[50vh] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full filter blur-3xl opacity-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.2 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
      />

      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Logo + Title Layout */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
            {/* Logo */}
            <motion.img
              src="/logo.png"
              alt="Chennaiyin Logo"
              className="h-[6rem] sm:h-[8rem] md:h-[11rem] w-auto object-contain drop-shadow-md opacity-90"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            {/* Texts */}
            <div className="flex flex-col items-center md:items-start">
              <motion.h1
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl drop-shadow-lg"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                CHENNAIYIN
              </motion.h1>
              <motion.h2
                className="text-gray-800 font-bold text-2xl sm:text-3xl mt-1 tracking-wide"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                JERSEY
              </motion.h2>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-xl mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShopNowClick}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-2xl shadow-xl overflow-hidden relative"
            >
              <Search className="w-6 h-6 mr-2" />
              <span className="text-lg">Shop Now</span>
            </motion.button>

            <motion.p
              className="text-gray-700 text-base font-medium leading-relaxed px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Discover authentic Chennaiyin jerseys designed for peak performance.
              Limited stock available — shop now!
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
