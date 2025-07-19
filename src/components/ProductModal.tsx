import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Jersey } from '../types';

interface ProductModalProps {
  jersey: Jersey | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (jersey: Jersey, size: string, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  jersey,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!jersey) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === jersey.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? jersey.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    onAddToCart(jersey, selectedSize, quantity);
    onClose();
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-4 md:inset-8 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl z-50 overflow-hidden"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Image Section */}
              <div className="lg:w-1/2 relative bg-gray-800/30">
                <div className="relative h-64 lg:h-full">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={jersey.images[currentImageIndex]}
                    alt={jersey.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {jersey.images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-600 text-white hover:border-blue-500 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-600 text-white hover:border-blue-500 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </>
                  )}

                  {/* Image Indicators */}
                  {jersey.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {jersey.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      {jersey.isNew && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                          NEW
                        </span>
                      )}
                      {jersey.isBestSeller && (
                        <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-semibold rounded">
                          BESTSELLER
                        </span>
                      )}
                      {jersey.isTrending && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                          TRENDING
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{jersey.name}</h1>
                    <p className="text-xl text-gray-400">{jersey.club}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(jersey.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400">
                      {jersey.rating} ({jersey.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold text-white">
                      ${jersey.price}
                    </span>
                    {jersey.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        ${jersey.originalPrice}
                      </span>
                    )}
                    {jersey.originalPrice && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded border border-red-500/30">
                        Save ${(jersey.originalPrice - jersey.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Type:</span>
                      <p className="text-white font-semibold">{jersey.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Material:</span>
                      <p className="text-white font-semibold">{jersey.material}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Category:</span>
                      <p className="text-white font-semibold">{jersey.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Full Kit:</span>
                      <p className="text-white font-semibold">{jersey.fullKit ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Select Size</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {jersey.sizes.map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSize(size)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            selectedSize === size
                              ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                              : 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-gray-600 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
                      >
                        -
                      </motion.button>
                      <span className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 border border-gray-600 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!selectedSize}
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-lg font-semibold transition-all duration-200 ${
                        selectedSize
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 border border-gray-600 rounded-lg text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{jersey.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                    <ul className="space-y-2">
                      {jersey.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-300">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};