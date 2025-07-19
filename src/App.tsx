import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterPanel } from './components/FilterPanel';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CategorySection } from './components/CategorySection';
import { AdvancedSearch } from './components/AdvancedSearch';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { jerseys } from './data/jerseys';
import { Jersey, ViewMode } from './types';
import { useFilters } from './hooks/useFilters';
import { useWishlist } from './hooks/useWishlist';
import { useCart } from './hooks/useCart';

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  const {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredJerseys
  } = useFilters(jerseys);

  const { wishlistedItems, toggleWishlist } = useWishlist();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartCount 
  } = useCart();

  const handleViewDetails = (jersey: Jersey) => {
    setSelectedJersey(jersey);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJersey(null);
  };

  const handleAddToCart = (jersey: Jersey, size: string, quantity: number = 1) => {
    addToCart(jersey, size, quantity);
  };
  // Get jerseys by categories for sections
  const playerVersionJerseys = jerseys.filter(j => j.type === 'Player Version');
  const masterCopyJerseys = jerseys.filter(j => j.type === 'Master Copy');
  const retroJerseys = jerseys.filter(j => j.type === 'Retro');
  const fullKitJerseys = jerseys.filter(j => j.fullKit);
  const newJerseys = jerseys.filter(j => j.isNew);
  const bestSellerJerseys = jerseys.filter(j => j.isBestSeller);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return (
          <AdvancedSearch
            jerseys={jerseys}
            onViewDetails={handleViewDetails}
            wishlistedItems={wishlistedItems}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentView('home')}
          />
        );
      
      case 'home':
      default:
        return (
          <>
            {/* Hero Section */}
            <Hero 
              onShopNowClick={() => setCurrentView('search')}
              onCustomizeClick={() => setCurrentView('customize')}
            />

            {/* Category Sections */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* New Arrivals */}
                <CategorySection
                  title="New Arrivals"
                  jerseys={newJerseys}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  wishlistedItems={wishlistedItems}
                  onToggleWishlist={toggleWishlist}
                  onViewAll={() => setCurrentView('search')}
                />

                {/* Best Sellers */}
                <CategorySection
                  title="Best Sellers"
                  jerseys={bestSellerJerseys}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  wishlistedItems={wishlistedItems}
                  onToggleWishlist={toggleWishlist}
                  onViewAll={() => setCurrentView('search')}
                />

                {/* Player Version */}
                <CategorySection
                  title="Player Version"
                  jerseys={playerVersionJerseys}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  wishlistedItems={wishlistedItems}
                  onToggleWishlist={toggleWishlist}
                  onViewAll={() => setCurrentView('search')}
                />

                {/* Retro Collection */}
                <CategorySection
                  title="Retro Collection"
                  jerseys={retroJerseys}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  wishlistedItems={wishlistedItems}
                  onToggleWishlist={toggleWishlist}
                  onViewAll={() => setCurrentView('search')}
                />

                {/* Full Kits */}
                <CategorySection
                  title="Full Kits"
                  jerseys={fullKitJerseys}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  wishlistedItems={wishlistedItems}
                  onToggleWishlist={toggleWishlist}
                  onViewAll={() => setCurrentView('search')}
                />
              </div>
            </section>
          </>
        );
    }
  };
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setIsFilterOpen(true)}
        cartCount={getCartCount()}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setCurrentView('search')}
        onCustomizeClick={() => setCurrentView('customize')}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Product Modal */}
      <ProductModal
        jersey={selectedJersey}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        cartTotal={getCartTotal()}
      />

      {/* Main Content */}
      <main>{renderCurrentView()}</main>

      {/* Footer */}
      {currentView === 'home' && <Footer />}
    </div>
  );
}

export default App;