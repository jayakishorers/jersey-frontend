import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Jersey } from '../types';

interface ProductCardProps {
  jersey: Jersey;
  onViewDetails: (jersey: Jersey) => void;
  onAddToCart: (jersey: Jersey, size: string, quantity: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (jerseyId: string) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  jersey,
  onViewDetails,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  viewMode = 'grid'
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeSelector(true);
      return;
    }
    onAddToCart(jersey, selectedSize, 1);
    setShowSizeSelector(false);
    setSelectedSize('');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ y: -8 }}
      className={`group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
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

      {/* Wishlist Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggleWishlist?.(jersey.id)}
        className="absolute top-3 right-3 z-10 p-2 bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-600 hover:border-red-500 transition-colors"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
          }`} 
        />
      </motion.button>

      {/* Image */}
      <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} overflow-hidden cursor-pointer`} onClick={() => onViewDetails(jersey)}>
        <motion.img
          whileHover={{ scale: 1.1 }}
          src={jersey.image}
          alt={jersey.name}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="flex space-x-3"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(jersey);
              }}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="mb-2">
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
            {jersey.name}
          </h3>
          <p className="text-gray-400 text-sm">{jersey.club}</p>
        </div>

        {/* Type and Material */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
            {jersey.type}
          </span>
          <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
            {jersey.material}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(jersey.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm">
            {jersey.rating} ({jersey.reviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              ${jersey.price}
            </span>
            {jersey.originalPrice && (
              <span className="text-gray-500 line-through">
                ${jersey.originalPrice}
              </span>
            )}
          </div>
          
          {jersey.fullKit && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
              Full Kit
            </span>
          )}
        </div>

        {/* Size Selector */}
        {showSizeSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600"
          >
            <p className="text-white text-sm mb-2">Select Size:</p>
            <div className="flex space-x-2">
              {jersey.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedSize === size
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="flex-1 py-2 bg-green-500 text-white rounded text-sm font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setShowSizeSelector(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Available Sizes */}
        <div className="pt-3 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available sizes:</p>
          <div className="flex space-x-1">
            {jersey.sizes.map((size) => (
              <span
                key={size}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};