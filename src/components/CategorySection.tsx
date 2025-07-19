import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Jersey } from '../types';
import { ChevronRight } from 'lucide-react';

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
  onViewAll
}) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-4xl font-bold text-white">{title}</h2>
          {onViewAll && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewAll}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jerseys.slice(0, 4).map((jersey, index) => (
            <motion.div
              key={jersey.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
      </div>
    </section>
  );
};