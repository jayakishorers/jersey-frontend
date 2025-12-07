import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Jersey } from "../types";
import { getThumbnail, getPlaceholder } from "../utils/imageUtils";

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
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if stock is actually loaded (has keys) vs just empty object
  const isStockLoading = !jersey.stockBySize || Object.keys(jersey.stockBySize).length === 0;
  const totalStock = jersey.stockBySize && Object.keys(jersey.stockBySize).length > 0
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
          <div className="relative">
            <div className="relative w-full aspect-square bg-gray-700 rounded-t-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <div className="text-2xl mb-1">👕</div>
                  <div className="text-xs">Loading...</div>
                </div>
              </div>
              <img
                src={`https://images.weserv.nl/?url=${encodeURIComponent(window.location.origin + jersey.image)}&w=300&q=60&output=webp&fallback=jpg`}
                alt={jersey.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  (isOutOfStock || isStockLoading) ? "opacity-70" : ""
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes(jersey.image)) {
                    target.src = jersey.image;
                  }
                  setImageLoaded(true);
                }}
              />
            </div>
          </div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-300">
              <div className="text-4xl mb-2">👕</div>
              <div className="text-xs">Loading...</div>
            </div>
          </div>
          <motion.img
            whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
            src={`https://images.weserv.nl/?url=${encodeURIComponent(window.location.origin + jersey.image)}&w=300&q=60&output=webp&fallback=jpg`}
            alt={jersey.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes(jersey.image)) {
                target.src = jersey.image;
              }
              setImageLoaded(true);
            }}
          />
          {/* Out of Stock overlay - only show after stock is loaded */}
          {isOutOfStock && (
            <>
              <div className="absolute inset-0 z-10 bg-white/25"></div>
              <div className="absolute bottom-0 left-0 right-0 z-20 text-white text-sm font-bold text-center py-1 bg-red-600">
                SOLD OUT
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