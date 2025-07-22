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
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      {/* --- Mobile Minimal View --- */}
      <div className="block sm:hidden" onClick={() => onViewDetails(jersey)}>
        <img src={jersey.image} alt={jersey.name} className="w-full aspect-square object-cover rounded-t-xl" />
        <div className="p-2 text-center">
          <p className="text-gray-800 text-sm font-semibold truncate">{jersey.name}</p>
        </div>
      </div>

      {/* --- Desktop Detailed View --- */}
      <div className="hidden sm:block">
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleWishlist?.(jersey.id)}
          className="absolute top-3 right-3 z-10 p-2 bg-white shadow-sm rounded-full border border-gray-300 hover:border-red-500 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </motion.button>

        {/* Jersey Image */}
        <div
          className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden cursor-pointer"
          onClick={() => onViewDetails(jersey)}
        >
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={jersey.image}
            alt={jersey.name}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        </div>

        {/* Jersey Info */}
        <div className="p-4">
          <h3 className="text-gray-900 font-semibold text-lg mb-1">{jersey.name}</h3>
          <p className="text-gray-500 text-sm">{jersey.club}</p>
          <div className="mt-2 text-gray-800 font-bold text-xl">${jersey.price}</div>
        </div>
      </div>
    </motion.div>
  );
};
