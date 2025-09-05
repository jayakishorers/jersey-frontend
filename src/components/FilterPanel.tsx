// All the import statements remain unchanged
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { categories } from '../data/jerseys';

interface FilterState {
  type: string[];
  category: string[];
  fullKit: string;
  fullSleeve: boolean; // 👈 added
  size: string[];
  sortBy: string;
}


interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange
}) => {
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    const newFilters = { ...filters };

    if (filterType === 'fullKit' || filterType === 'sortBy') {
      newFilters[filterType] = value as any;
    } else {
      const currentValues = newFilters[filterType] as string[];
      if (currentValues.includes(value)) {
        newFilters[filterType] = currentValues.filter(v => v !== value) as any;
      } else {
        newFilters[filterType] = [...currentValues, value] as any;
      }
    }

    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
  onFilterChange({
    type: [],
    category: [],
    fullKit: '',
    fullSleeve: false, // 👈 added
    size: [],
    sortBy: ''
  });
};


  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('lock-scroll');
    } else {
      document.body.classList.remove('lock-scroll');
    }

    return () => {
      document.body.classList.remove('lock-scroll');
    };
  }, [isOpen]);

  const FilterCheckbox: React.FC<{
    checked: boolean;
    onChange: () => void;
    label: string;
  }> = ({ checked, onChange, label }) => (
    <motion.label
      whileHover={{ scale: 1.02 }}
      className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
    >
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div
          className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
            checked ? 'bg-white-500 border-blue-500' : 'border-gray-500 hover:border-blue-400'
          }`}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 text-white absolute top-0.5 left-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </motion.svg>
          )}
        </div>
      </div>
      <span className="text-gray-300 text-sm">{label}</span>
    </motion.label>
  );

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: 0, y: '100%' }}
            animate={{ x: 0, y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-full sm:left-0 sm:h-full sm:w-80 bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50 z-50 overflow-y-auto"
          >
            <div className="p-6 px-4 overflow-x-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2 sm:flex-nowrap">
                <h2 className="text-2xl font-bold text-white">Filters</h2>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearAllFilters}
                    className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    title="Clear all filters"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="bestseller">Best Selling</option>
                </select>
              </div>

              {/* Jersey Type */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Jersey Type</h3>
                <div className="space-y-1">
                  {categories.types
                    .filter((type) => ['Replica', 'Master Copy', 'Player Edition', 'Sublimation'].includes(type))
                    .map((type) => (
                      <FilterCheckbox
                        key={type}
                        checked={filters.type.includes(type)}
                        onChange={() => handleFilterChange('type', type)}
                        label={type}
                      />
                    ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Category</h3>
                <div className="space-y-1">
                  {categories.categories
                    .filter((category) => category !== 'Cricket')
                    .map((category) => (
                      <FilterCheckbox
                        key={category}
                        checked={filters.category.includes(category)}
                        onChange={() => handleFilterChange('category', category)}
                        label={category}
                      />
                    ))}
                </div>
              </div>

              {/* Full Kit */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Full Kit</h3>
                <div className="space-y-1">
                  <FilterCheckbox
                    checked={filters.fullKit === 'yes'}
                    onChange={() =>
                      handleFilterChange('fullKit', filters.fullKit === 'yes' ? '' : 'yes')
                    }
                    label="Full Kit Available"
                  />
                </div>
              </div>
{/* Full Sleeve */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-white mb-3">Sleeve Type</h3>
  <div className="space-y-1">
    <FilterCheckbox
      checked={filters.fullSleeve}
      onChange={() =>
        onFilterChange({ ...filters, fullSleeve: !filters.fullSleeve })
      }
      label="Full Sleeve Only"
    />
  </div>
</div>

              {/* Size */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {categories.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFilterChange('size', size)}
                      className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                        filters.size.includes(size)
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
