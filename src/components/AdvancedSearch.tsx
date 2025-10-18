  import React, { useState, useEffect } from 'react';
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
    sectionTitle?: string | null;
  }

  export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
    jerseys,
    onViewDetails,
    wishlistedItems,
    onToggleWishlist,
    onAddToCart,
    onBack,
    sectionTitle
  }) => {
    
    // Generate dynamic filter options based on current jerseys
    const getAvailableOptions = () => {
      const types = [...new Set(jerseys.map(j => j.type))];
      const materials = [...new Set(jerseys.map(j => j.material))];
      const categories = [...new Set(jerseys.map(j => j.category))];
      const sizes = [...new Set(jerseys.flatMap(j => j.sizes))];
      
      return { types, materials, categories, sizes };
    };
    
    const availableOptions = getAvailableOptions();
    
    // All homepage sections
    const sections = [
      'New Arrivals',
      'Best Sellers', 
      'Country Jerseys',
      'Club Jerseys',
      'Trending',
      'Retro Collection',
      'Full Kit',
      'Master Copy',
      'Sublimation'
    ];
    
    const handleSectionClick = (section: string) => {
      if (selectedSection === section) {
        setSelectedSection(null);
        // Clear corresponding filters when deselecting section
        if (section === 'LooseFit/FiveSleeve') {
          setFilters(prev => ({ ...prev, loosefit: [] }));
        }
      } else {
        setSelectedSection(section);
        // Auto-select corresponding filters when selecting section
        if (section === 'LooseFit/FiveSleeve') {
          setFilters(prev => ({ ...prev, loosefit: ['Yes'] }));
        }
      }
    };
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [filters, setFilters] = useState<FilterState>({
      type: [],
      material: [],
      category: [],
      fullKit: '',
      size: [],
      sortBy: '',
      fullSleeve: false,
      priceRange: [0, 1000],
      rating: 0,
      loosefit: []
    });
    
    const [selectedSection, setSelectedSection] = useState<string | null>(sectionTitle);
    
    // Auto-select filters when coming from a section
    useEffect(() => {
      if (sectionTitle === 'LooseFit/FiveSleeve') {
        setFilters(prev => ({ ...prev, loosefit: ['Yes'] }));
      }
    }, [sectionTitle]);

    const filteredJerseys = jerseys.filter(jersey => {
      // Section-specific filtering
      if (selectedSection) {
        switch (selectedSection) {
          case 'New Arrivals':
            if (!jersey.isNew) return false;
            break;
          case 'Best Sellers':
            if (!jersey.isBestSeller) return false;
            break;
          case 'Country Jerseys':
            if (jersey.category !== 'Country') return false;
            break;
          case 'Club Jerseys':
            if (jersey.category !== 'Club') return false;
            break;
          case 'Trending':
            if (!jersey.isTrending) return false;
            break;
          case 'Retro Collection':
            if (jersey.type !== 'Retro') return false;
            break;
          case 'Full Kit':
            if (!jersey.fullKit) return false;
            break;
          case 'Master Copy':
            if (jersey.type !== 'Master Copy') return false;
            break;
          case 'Sublimation':
            if (jersey.type !== 'Sublimation') return false;
            break;
          case 'LooseFit/FiveSleeve':
            if (!jersey.isloosefit) return false;
            break;
        }
      }
      
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
      if (filters.loosefit.length > 0 && filters.loosefit.includes('Yes') && !jersey.isloosefit) return false;
      if (jersey.price < filters.priceRange[0] || jersey.price > filters.priceRange[1]) return false;

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'bestseller': return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        default: return 0;
      }
    });

    const totalPages = Math.ceil(filteredJerseys.length / itemsPerPage);
    const paginatedJerseys = filteredJerseys.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

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
      <div className="min-h-screen bg-gray-900 pt-20 overflow-x-hidden">

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
                <h1 className="text-4xl font-bold text-white mb-2">{sectionTitle || 'Advanced Search'}</h1>
                <p className="text-gray-400">{sectionTitle ? `Browse all ${sectionTitle.toLowerCase()} jerseys` : 'Find your perfect jersey with our advanced filtering system'}</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
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
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium shadow-sm"
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
{/* Mobile Filter & Sort Bar */}
<div className="flex justify-between items-center mb-4 md:hidden">
  <button
    onClick={() => {
      setShowFilters(true);
    }}
    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
  >
    <SlidersHorizontal className="w-4 h-4" />
    Filter
  </button>

  <button
    onClick={() => {
      // Optional: Implement Sort modal logic
    }}
    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
  >
    <List className="w-4 h-4" />
    Sort
  </button>
</div>

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
      max="1000"
      value={filters.priceRange[1]}
      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
    />
    <div className="flex justify-between text-sm text-gray-400">
      <span>Rs0</span>
      <span className="text-blue-400 font-semibold">Rs{filters.priceRange[1]}</span>
    </div>
  </div>
</div>



{/* Sections Filter */}
<div className="mb-6">
  <h4 className="text-white font-semibold mb-3">Sections</h4>
  <div className="space-y-2">
    {sections.map((section) => (
      <label key={section} className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={selectedSection === section}
          onChange={() => handleSectionClick(section)}
          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
        />
        <span className="text-gray-300">{section}</span>
      </label>
    ))}
  </div>
</div>

{/* Dynamic Filters */}
{Object.entries({
  'Jersey Type': { key: 'type', options: availableOptions.types },
  'Category': { key: 'category', options: availableOptions.categories },
  'Size': { key: 'size', options: availableOptions.sizes },
  'LooseFit': { key: 'loosefit', options: ['Yes'] }
}).map(([title, { key, options }]) => (
  <div key={key} className="mb-6">
    <h4 className="text-white font-semibold mb-3">
      {title}
      {key === 'size' && (
        <span className="text-xs text-gray-400 block mt-1">
          Filter by available sizes
        </span>
      )}
    </h4>
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
            
            {/* Mobile Filter Bottom Sheet */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  className="fixed inset-x-0 bottom-0 z-50 bg-gray-900 border-t border-gray-700 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto md:hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 text-gray-400 hover:text-white rounded-lg"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Mobile Sections Filter */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3 text-lg">Sections</h4>
                    <div className="space-y-3">
                      {sections.map((section) => (
                        <label key={section} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800">
                          <input
                            type="checkbox"
                            checked={selectedSection === section}
                            onChange={() => handleSectionClick(section)}
                            className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 w-5 h-5"
                          />
                          <span className="text-gray-300 text-lg">{section}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mobile Other Filters */}
                  {Object.entries({
                    'Jersey Type': { key: 'type', options: availableOptions.types },
                    'Category': { key: 'category', options: availableOptions.categories },
                    'Size': { key: 'size', options: availableOptions.sizes },
                    'LooseFit': { key: 'loosefit', options: ['Yes'] }
                  }).map(([title, { key, options }]) => (
                    <div key={key} className="mb-6">
                      <h4 className="text-white font-semibold mb-3 text-lg">
                        {title}
                        {key === 'size' && (
                          <span className="text-sm text-gray-400 block mt-1">
                            Filter by available sizes
                          </span>
                        )}
                      </h4>
                      <div className="space-y-3">
                        {options.map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800">
                            <input
                              type="checkbox"
                              checked={(filters[key as keyof FilterState] as string[]).includes(option)}
                              onChange={() => handleFilterChange(key as keyof FilterState, option)}
                              className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 w-5 h-5"
                            />
                            <span className="text-gray-300 text-lg">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Apply Button */}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl text-lg"
                  >
                    Apply Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
                        {/* Mobile Filter & Sort Bar - Thumb-friendly */}
            <div className="md:hidden w-full sticky top-[64px] z-30 bg-gray-900 py-4 px-4 border-b border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium text-base flex-1"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                </button>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white text-base flex-1"
                >
                  <option value="">Sort</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="bestseller">Best Selling</option>
                </select>
              </div>
            </div>


              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {searchQuery ? `Results for "${searchQuery}"` : (sectionTitle || 'All Jerseys')}
                  </h2>
                  <p className="text-gray-400">{filteredJerseys.length} jerseys found</p>
                </div>
                
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className=" hidden md:px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                jerseys={paginatedJerseys}
                onViewDetails={onViewDetails}
                wishlistedItems={wishlistedItems}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                viewMode={viewMode}
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <span className="text-white px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };