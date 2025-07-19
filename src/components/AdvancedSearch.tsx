import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal, X, Star, TrendingUp } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { Jersey, FilterState } from '../types';
import { categories } from '../data/jerseys';

interface AdvancedSearchProps {
  jerseys: Jersey[];
  onViewDetails: (jersey: Jersey) => void;
  wishlistedItems: string[];
  onToggleWishlist: (jerseyId: string) => void;
  onAddToCart: (jersey: Jersey, size: string, quantity: number) => void;
  onBack: () => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  jerseys,
  onViewDetails,
  wishlistedItems,
  onToggleWishlist,
  onAddToCart,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    material: [],
    category: [],
    fullKit: '',
    size: [],
    sortBy: '',
    priceRange: [0, 200],
    rating: 0
  });

  const filteredJerseys = jerseys.filter(jersey => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        jersey.name.toLowerCase().includes(searchLower) ||
        jersey.club.toLowerCase().includes(searchLower) ||
        jersey.type.toLowerCase().includes(searchLower) ||
        jersey.material.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Apply all filters
    if (filters.type.length > 0 && !filters.type.includes(jersey.type)) return false;
    if (filters.material.length > 0 && !filters.material.includes(jersey.material)) return false;
    if (filters.category.length > 0 && !filters.category.includes(jersey.category)) return false;
    if (filters.fullKit === 'yes' && !jersey.fullKit) return false;
    if (filters.size.length > 0) {
      const hasMatchingSize = filters.size.some(size => jersey.sizes.includes(size as any));
      if (!hasMatchingSize) return false;
    }
    if (jersey.price < filters.priceRange[0] || jersey.price > filters.priceRange[1]) return false;
    if (jersey.rating < filters.rating) return false;

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'bestseller': return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      default: return 0;
    }
  });

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => {
      if (filterType === 'fullKit' || filterType === 'sortBy' || filterType === 'priceRange' || filterType === 'rating') {
        return { ...prev, [filterType]: value };
      } else {
        const currentValues = prev[filterType] as string[];
        if (currentValues.includes(value)) {
          return { ...prev, [filterType]: currentValues.filter(v => v !== value) };
        } else {
          return { ...prev, [filterType]: [...currentValues, value] };
        }
      }
    });
  };
const handleSearchClick = () => {
  setShowFilters(false); // This closes the filter panel
};

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900/20 to-green-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <button
                onClick={onBack}
                className="text-blue-400 hover:text-blue-300 mb-2 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
              <h1 className="text-4xl font-bold text-white mb-2">Advanced Search</h1>
              <p className="text-gray-400">Find your perfect jersey with our advanced filtering system</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-blue-500 transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-blue-500 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jerseys, clubs, players..."
              className="block w-full pl-12 pr-4 py-4 border border-gray-600 rounded-xl bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-80 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 h-fit sticky top-24"
              >
                <h3 className="text-xl font-bold text-white mb-6">Filters</h3>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{filteredJerseys.length}</div>
                    <div className="text-xs text-gray-400">Results</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{jerseys.filter(j => j.isNew).length}</div>
                    <div className="text-xs text-gray-400">New</div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>$0</span>
                      <span className="text-blue-400 font-semibold">${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Minimum Rating</h4>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleFilterChange('rating', rating === filters.rating ? 0 : rating)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
                          filters.rating >= rating
                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                            : 'border-gray-600 text-gray-400 hover:border-yellow-400'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                        <span>{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other filters... */}
                {Object.entries({
                  'Jersey Type': { key: 'type', options: categories.types },
                  'Material': { key: 'material', options: categories.materials },
                  'Category': { key: 'category', options: categories.categories },
                  'Size': { key: 'size', options: categories.sizes }
                }).map(([title, { key, options }]) => (
                  <div key={key} className="mb-6">
                    <h4 className="text-white font-semibold mb-3">{title}</h4>
                    <div className="space-y-2">
                      {options.map((option) => (
                        <label key={option} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(filters[key as keyof FilterState] as string[]).includes(option)}
                            onChange={() => handleFilterChange(key as keyof FilterState, option)}
                            className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Search Button */}
<button
  onClick={handleSearchClick}
  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
>
  Search
</button>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {searchQuery ? `Results for "${searchQuery}"` : 'All Jerseys'}
                </h2>
                <p className="text-gray-400">{filteredJerseys.length} jerseys found</p>
              </div>
              
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="bestseller">Best Selling</option>
              </select>
            </div>

            {/* Products */}
            <ProductGrid
              jerseys={filteredJerseys}
              onViewDetails={onViewDetails}
              wishlistedItems={wishlistedItems}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};