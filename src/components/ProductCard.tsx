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

  const totalStock = jersey.stockBySize
    ? Object.values(jersey.stockBySize).reduce((sum, qty) => sum + qty, 0)
    : 0;
  const isOutOfStock = totalStock === 0;

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
      className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md relative"
    >
      {/* --- Mobile View --- */}
      <div className="block sm:hidden" onClick={() => onViewDetails(jersey)}>
        <div className="relative">
          <img
            src={jersey.image}
            alt={jersey.name}
            className={`w-full aspect-square object-cover rounded-t-xl ${
              isOutOfStock ? "opacity-70" : ""
            }`}
          />

          {/* Sold Out Banner (Bottom) */}
          {isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs font-bold text-center py-1">
              SOLD OUT
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-2 text-center">
          <p className="text-gray-800 text-sm font-semibold truncate">
            {jersey.name}
          </p>
          {/* Price */}
          <div className="mt-1 flex items-center justify-center space-x-2">
            <span className="text-base font-bold text-gray-900">
              ₹{jersey.price.toLocaleString()}
            </span>
            {jersey.originalPrice && jersey.originalPrice > jersey.price && (
              <>
                <span className="text-sm line-through text-gray-400">
                  ₹{jersey.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
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
          className="absolute top-3 right-3 z-20 p-2 bg-white shadow-sm rounded-full border border-gray-300 hover:border-red-500 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </motion.button>

        {/* Image */}
        <div
          className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden cursor-pointer"
          onClick={() => onViewDetails(jersey)}
        >
          <motion.img
            whileHover={{ scale: isOutOfStock ? 1 : 1.1 }}
            src={jersey.image}
            alt={jersey.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isOutOfStock ? "opacity-70" : ""
            }`}
          />

          {/* Sold Out Banner (Bottom) */}
          {isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-sm font-bold text-center py-1">
              SOLD OUT
            </div>
          )}
        </div>

        {/* Info */}
        <div
          className="p-4 cursor-pointer"
          onClick={() => onViewDetails(jersey)}
        >
          <h3 className="text-gray-900 font-semibold text-lg mb-1">
            {jersey.name}
          </h3>
          <p className="text-gray-500 text-sm">{jersey.club}</p>

          {/* Price */}
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{jersey.price.toLocaleString()}
            </span>
            {jersey.originalPrice && jersey.originalPrice > jersey.price && (
              <>
                <span className="text-sm line-through text-gray-400">
                  ₹{jersey.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded">
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
