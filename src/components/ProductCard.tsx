import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Jersey } from "../types";

interface ProductCardProps {
  jersey: Jersey & { stockBySize?: Record<string, number> };
  onViewDetails: (jersey: Jersey) => void;
  onAddToCart: (jersey: Jersey, size: string, quantity: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (jerseyId: string) => void;
  viewMode?: "grid" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  jersey,
  onViewDetails,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  viewMode = "grid",
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const isStockLoading = !jersey.stockBySize;
  const totalStock = jersey.stockBySize
    ? Object.values(jersey.stockBySize).reduce((sum, qty) => sum + qty, 0)
    : 0;
  const isOutOfStock = totalStock === 0 && !isStockLoading;

  const discountPercentage =
    jersey.originalPrice && jersey.originalPrice > jersey.price
      ? Math.round(((jersey.originalPrice - jersey.price) / jersey.originalPrice) * 100)
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ y: -4 }}
      className="bg-gray-900 text-white border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md relative"
    >
      {/* --- Mobile View --- */}
      <div className="block sm:hidden" onClick={() => onViewDetails(jersey)}>
        <div className="relative bg-gray-800">
          <img
            src={jersey.image}
            alt={jersey.name}
            className={`w-full aspect-square object-cover rounded-t-xl transition-opacity duration-300 ${
              (isOutOfStock || isStockLoading) ? "opacity-70" : ""
            }`}
            loading="lazy"
            style={{ backgroundColor: '#f3f4f6' }}
          />
          {isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs font-bold text-center py-1">
              SOLD OUT
            </div>
          )}
        </div>
        <div className="p-3 text-center">
          <p className="text-white text-sm font-semibold truncate">{jersey.name}</p>
          <div className="mt-1 flex items-center justify-center space-x-2">
            <span className="text-base font-bold text-white">
              ₹{jersey.price.toLocaleString()}
            </span>
            {jersey.originalPrice && jersey.originalPrice > jersey.price && (
              <>
                <span className="text-sm line-through text-gray-400">
                  ₹{jersey.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-green-400 bg-green-800 px-1.5 py-0.5 rounded">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Desktop View --- */}
      <div className="hidden sm:block relative">
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleWishlist?.(jersey.id)}
          className="absolute top-3 right-3 z-20 p-2 bg-gray-800 shadow-sm rounded-full border border-gray-700 hover:border-red-500 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </motion.button>
        {/* Image Section */}
        <div
          className="relative w-full aspect-[3/4] bg-gray-800 overflow-hidden cursor-pointer"
          onClick={() => onViewDetails(jersey)}
        >
          <motion.img
            whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
            src={jersey.image}
            alt={jersey.name}
            className="w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
            style={{ backgroundColor: '#f3f4f6' }}
          />
          {/* Loading or Out of Stock overlay */}
          {(isStockLoading || isOutOfStock) && (
            <>
              <div className="absolute inset-0 z-10 bg-white/25"></div>
              <div className={`absolute bottom-0 left-0 right-0 z-20 text-white text-sm font-bold text-center py-1 ${
                isStockLoading ? 'bg-blue-600' : 'bg-red-600'
              }`}>
                {isStockLoading ? 'LOADING STOCK...' : 'SOLD OUT'}
              </div>
            </>
          )}
        </div>
        {/* Info Section */}
        <div className="p-4 cursor-pointer lg:min-h-[90px] lg:flex lg:flex-col lg:justify-between bg-gray-900" onClick={() => onViewDetails(jersey)}>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-1 lg:text-sm lg:leading-tight">
              {jersey.name}
            </h3>
            <p className="text-gray-400 text-sm lg:text-xs">{jersey.club}</p>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xl font-bold text-white lg:text-base">
              ₹{jersey.price.toLocaleString()}
            </span>
            {jersey.originalPrice && jersey.originalPrice > jersey.price && (
              <>
                <span className="text-sm line-through text-gray-500 lg:hidden">
                  ₹{jersey.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-green-400 bg-green-800 px-2 py-0.5 rounded lg:px-1">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};