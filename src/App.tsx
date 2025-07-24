import React, { useState } from 'react';
import { CategorySection } from './components/CategorySection';
import { StaticCategoryCarousel } from './components/StaticCategoryCarousel';
import { ProductModal } from './components/ProductModal';
import { jerseys } from './data/jerseys';

import { Navbar } from './components/Navbar';         // ✅ Navbar
import { Hero } from './components/Hero';             // ✅ Hero section
import { Footer } from './components/Footer';         // ✅ Footer

const App: React.FC = () => {
  const [selectedJersey, setSelectedJersey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const handleViewDetails = (jersey: any) => {
    setSelectedJersey(jersey);
    setIsModalOpen(true);
  };

  const handleAddToCart = (jersey: any, size: string, quantity: number) => {
    console.log("Add to Cart:", jersey, size, quantity);
    setIsModalOpen(false);
  };

  const handleToggleWishlist = (jerseyId: string) => {
    setWishlist((prev) =>
      prev.includes(jerseyId)
        ? prev.filter((id) => id !== jerseyId)
        : [...prev, jerseyId]
    );
  };
  const [searchQuery, setSearchQuery] = useState('');
const [isDark, setIsDark] = useState(false); // if you have a dark mode switch
const cartItems = []; // Replace with your real cart state

const handleSearchChange = (query: string) => {
  setSearchQuery(query);
};

const handleFilterToggle = () => {
  console.log('Filter toggle clicked');
};

const handleProfileClick = () => {
  console.log('Navigate to profile page');
};

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ✅ Navbar at top */}
      <Navbar
  searchQuery={searchQuery}
  onSearchChange={handleSearchChange}
  onFilterToggle={handleFilterToggle}
  cartCount={cartItems.length}
  onCartClick={() => console.log('Go to cart')}
  onSearchClick={() => console.log('Search bar clicked')}
  onCustomizeClick={() => console.log('Customize clicked')}
/>

      {/* ✅ Hero Section */}
      <Hero
        onShopNowClick={() => {
          const section = document.getElementById('category-sections');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }}
        onCustomizeClick={() => {
          console.log("Customize button clicked");
        }}
      />

      {/* ✅ Horizontal category carousel */}
      <StaticCategoryCarousel />

      {/* ✅ Product sections */}
      <div id="category-sections">
        <CategorySection title="New Arrivals" jerseys={jerseys.filter(j => j.isNew && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Best Sellers" jerseys={jerseys.filter(j => j.isBestSeller && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Country Jerseys" jerseys={jerseys.filter(j => j.category === 'Country')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Club Jerseys" jerseys={jerseys.filter(j => j.category === 'Club')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Trending" jerseys={jerseys.filter(j => j.isTrending && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Retro Collection" jerseys={jerseys.filter(j => j.type === 'Retro' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Full Kit" jerseys={jerseys.filter(j => j.fullKit && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Full Sleeve" jerseys={jerseys.filter(j => j.type === 'Full Sleeve' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Master Copy" jerseys={jerseys.filter(j => j.type === 'Master Copy' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Player Version" jerseys={jerseys.filter(j => j.type === 'Player Version' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Sublimation" jerseys={jerseys.filter(j => j.type === 'Sublimation' && j.category !== 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
        <CategorySection title="Cricket" jerseys={jerseys.filter(j => j.category === 'Cricket')} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} wishlistedItems={wishlist} onToggleWishlist={handleToggleWishlist} />
      </div>

      {/* ✅ Jersey details popup */}
      {selectedJersey && (
        <ProductModal
          jersey={selectedJersey}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* ✅ Footer at bottom */}
      <Footer />
    </div>
  );
};

export default App;
