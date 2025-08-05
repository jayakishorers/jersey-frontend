import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CategorySection } from './components/CategorySection';
import { StaticCategoryCarousel } from './components/StaticCategoryCarousel';
import { ProductModal } from './components/ProductModal';
import { jerseys } from './data/jerseys';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { Jersey } from './types';
import { AdvancedSearch } from './components/AdvancedSearch';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import { useCart } from './hooks/useCart';  // updated
// ✅ Correct import for src/CheckoutPage.tsx
import CheckoutPage from './CheckOutPage';

const OrderSuccess = () => (
  <div className="min-h-screen flex items-center justify-center text-white text-center p-8">
    <div>
      <h1 className="text-3xl font-bold mb-4">🎉 Order Placed Successfully!</h1>
      <p className="text-lg">Thank you for your purchase. We’ll notify you once it’s shipped.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount
  } = useCart();

  const handleViewDetails = (jersey: Jersey) => {
    setSelectedJersey(jersey);
    setIsModalOpen(true);
  };

  const handleAddToCart = (jersey: Jersey, size: string, quantity: number) => {
    addToCart(jersey, size, quantity);
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

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar
        cartCount={getCartCount()}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        cartTotal={getCartTotal()}
      />

      <Routes>
        <Route
          path="/"
          element={
            showAdvancedSearch ? (
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

                {/* Category Sections */}
                <div id="new-arrivals">
                  <CategorySection
                    title="New Arrivals"
                    jerseys={jerseys.filter(j => j.isNew && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="best-sellers">
                  <CategorySection
                    title="Best Sellers"
                    jerseys={jerseys.filter(j => j.isBestSeller && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="country-jerseys">
                  <CategorySection
                    title="Country Jerseys"
                    jerseys={jerseys.filter(j => j.category === 'Country')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="club-jerseys">
                  <CategorySection
                    title="Club Jerseys"
                    jerseys={jerseys.filter(j => j.category === 'Club')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="trending">
                  <CategorySection
                    title="Trending"
                    jerseys={jerseys.filter(j => j.isTrending && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="retro-collection">
                  <CategorySection
                    title="Retro Collection"
                    jerseys={jerseys.filter(j => j.type === 'Retro' && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="full-kit">
                  <CategorySection
                    title="Full Kit"
                    jerseys={jerseys.filter(j => j.fullKit && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="full-sleeve">
                  <CategorySection
                    title="Full Sleeve"
                    jerseys={jerseys.filter(j => j.type === 'Full Sleeve' && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="master-copy">
                  <CategorySection
                    title="Master Copy"
                    jerseys={jerseys.filter(j => j.type === 'Master Copy' && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="player-version">
                  <CategorySection
                    title="Player Version"
                    jerseys={jerseys.filter(j => j.type === 'Player Version' && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="sublimation">
                  <CategorySection
                    title="Sublimation"
                    jerseys={jerseys.filter(j => j.type === 'Sublimation' && j.category !== 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
                <div id="cricket">
                  <CategorySection
                    title="Cricket"
                    jerseys={jerseys.filter(j => j.category === 'Cricket')}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
              </>
            )
          }
        />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            localStorage.getItem('token') ? <Dashboard /> : <Navigate to="/signin" replace />
          }
        />
        <Route
  path="/checkout"
  element={
    <CheckoutPage
      cartItems={cartItems}
      cartTotal={getCartTotal()}
      onClearCart={() => {
        localStorage.removeItem('cart');
        setIsCartOpen(false);
      }}
    />
  }
/>

<Route path="/order-success" element={<OrderSuccess />} />

      </Routes>

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
