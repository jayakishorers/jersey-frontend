import React, { useState } from 'react';
import { CategorySection } from './components/CategorySection';
import { StaticCategoryCarousel } from './components/StaticCategoryCarousel';
import { ProductModal } from './components/ProductModal';
import { jerseys } from './data/jerseys';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { Jersey } from './types'; // make sure your types file is correctly referenced
import { AdvancedSearch } from './components/AdvancedSearch';

const App: React.FC = () => {
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleViewDetails = (jersey: Jersey) => {
    setSelectedJersey(jersey);
    setIsModalOpen(true);
  };

  const handleAddToCart = (jersey: Jersey, size: string, quantity: number) => {
    console.log("Add to Cart:", jersey, size, quantity);
    setIsModalOpen(false);
  };

  const handleToggleWishlist = (jerseyId: string) => {
    setWishlist(prev =>
      prev.includes(jerseyId)
        ? prev.filter(id => id !== jerseyId)
        : [...prev, jerseyId]
    );
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchClick = () => {
    setShowAdvancedSearch(true);
  };

  const handleBackFromSearch = () => {
    setShowAdvancedSearch(false);
    setSearchQuery('');
  };

  const handleFilterToggle = () => {
    console.log('Filter toggle clicked');
  };

  const cartItems: any[] = []; // Replace with your actual cart logic

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterToggle={handleFilterToggle}
        cartCount={cartItems.length}
        onCartClick={() => console.log('Go to cart')}
        onSearchClick={handleSearchClick}
        onCustomizeClick={() => console.log('Customize clicked')}
      />

      {showAdvancedSearch ? (
        <AdvancedSearch
          jerseys={jerseys}
          onViewDetails={handleViewDetails}
          wishlistedItems={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onBack={handleBackFromSearch}
        />
      ) : (
        <>
          <Hero
            onShopNowClick={handleSearchClick}
            onCustomizeClick={() => console.log('Customize clicked')}
          />

          <StaticCategoryCarousel />

          <div id="new-arrivals">
            <CategorySection
              title="New Arrivals"
              jerseys={jerseys.filter(j => j.isNew && j.category !== 'Cricket')}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
              wishlistedItems={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
            {/* Add other sections like Best Sellers, Country Jerseys, etc., just like you already had */}
          </div>
            <div id="best-sellers">
              <CategorySection title="Best Sellers" jerseys={jerseys.filter(j => j.isBestSeller && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="country-jerseys">
              <CategorySection title="Country Jerseys" jerseys={jerseys.filter(j => j.category === 'Country')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="club-jerseys">
              <CategorySection title="Club Jerseys" jerseys={jerseys.filter(j => j.category === 'Club')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="trending">
              <CategorySection title="Trending" jerseys={jerseys.filter(j => j.isTrending && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="retro-collection">
              <CategorySection title="Retro Collection" jerseys={jerseys.filter(j => j.type === 'Retro' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="full-kit">
              <CategorySection title="Full Kit" jerseys={jerseys.filter(j => j.fullKit && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="full-sleeve">
              <CategorySection title="Full Sleeve" jerseys={jerseys.filter(j => j.type === 'Full Sleeve' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="master-copy">
              <CategorySection title="Master Copy" jerseys={jerseys.filter(j => j.type === 'Master Copy' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="player-version">
              <CategorySection title="Player Version" jerseys={jerseys.filter(j => j.type === 'Player Version' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="sublimation">
              <CategorySection title="Sublimation" jerseys={jerseys.filter(j => j.type === 'Sublimation' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
            <div id="cricket">
              <CategorySection title="Cricket" jerseys={jerseys.filter(j => j.category === 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
            </div>
        </>
      )}

      {selectedJersey && (
        <ProductModal
          jersey={selectedJersey}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
