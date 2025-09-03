import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { Jersey } from "../types";

interface ProductGridProps {
  jerseys: (Jersey & { stockBySize?: Record<string, number> })[];
  onViewDetails: (jersey: Jersey) => void;
  onAddToCart: (jersey: Jersey, size: string, quantity: number) => void;
  wishlistedItems: string[];
  onToggleWishlist: (jerseyId: string) => void;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  jerseys,
  onViewDetails,
  onAddToCart,
  wishlistedItems,
  onToggleWishlist,
  isLoading = false,
  viewMode = "grid",
}) => {
  // --- Loading State ---
  if (isLoading) {
    return (
      <div
        className={`grid gap-4 p-4 bg-white ${
          viewMode === "list"
            ? "grid-cols-1"
            : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-200 border border-gray-300 rounded-xl animate-pulse"
          >
            <div className="w-full h-full flex flex-col justify-center items-center p-4 space-y-3">
              <div className="w-3/4 h-4 bg-gray-300 rounded" />
              <div className="w-1/2 h-3 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- Empty State ---
  if (jerseys.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white"
      >
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m-6 0l4 4-4-4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No jerseys found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters to find what you're
            looking for.
          </p>
        </div>
      </motion.div>
    );
  }

  // --- Grid/List View ---
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid gap-4 p-4 bg-white ${
        viewMode === "list"
          ? "grid-cols-1"
          : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      <AnimatePresence mode="popLayout">
        {jerseys.map((jersey, index) => (
          <motion.div
            key={jersey.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ProductCard
              jersey={jersey}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistedItems.includes(jersey.id)}
              onToggleWishlist={onToggleWishlist}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
