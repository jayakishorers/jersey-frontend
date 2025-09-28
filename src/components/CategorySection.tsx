import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Jersey } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  jerseys: Jersey[];
  onViewDetails: (jersey: Jersey) => void;
  onAddToCart: (jersey: Jersey, size: string, quantity: number) => void;
  wishlistedItems: string[];
  onToggleWishlist: (jerseyId: string) => void;
  onViewAll?: () => void;
  
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  jerseys,
  onViewDetails,
  onAddToCart,
  wishlistedItems,
  onToggleWishlist,
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -250 : 250,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-10 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          {onViewAll && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewAll}
              className="flex items-center text-blue-600 hover:text-blue-500 transition"
            >
              <span className="mr-1">View All</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-gray-200 hover:bg-blue-500 text-gray-700 hover:text-white p-1.5 rounded-full shadow transition"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-gray-200 hover:bg-blue-500 text-gray-700 hover:text-white p-1.5 rounded-full shadow transition"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Jersey Scroll Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 scroll-smooth pb-2 no-scrollbar"
        >
          {jerseys.map((jersey, index) => (
            <motion.div
              key={jersey.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] lg:min-w-[210px] lg:max-w-[210px] flex-shrink-0 bg-gray-900 border border-gray-700 rounded-xl shadow hover:shadow-blue-300/30 transition-shadow"
            >
              <ProductCard
                jersey={jersey}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                isWishlisted={wishlistedItems.includes(jersey.id)}
                onToggleWishlist={onToggleWishlist}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-3 text-center text-xs text-gray-500 sm:hidden animate-pulse">
          👉 Swipe to view more
        </div>
      </div>
    </section>
  );
};
