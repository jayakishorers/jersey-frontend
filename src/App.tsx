import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CategorySection } from "./components/CategorySection";
import { StaticCategoryCarousel } from "./components/StaticCategoryCarousel";
import { ProductModal } from "./components/ProductModal";
import { jerseys } from "./data/jerseys";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import Footer from "./components/Footer";
import { Jersey } from "./types";
import { AdvancedSearch } from "./components/AdvancedSearch";
import SignIn from "./SignIn";
import AdminPage from "./AdminPage";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import { useCart } from "./hooks/useCart";
import { useWishlist } from "./hooks/useWishlist";
import CheckoutPage from "./CheckOutPage";
import { CartDrawer } from "./components/CartDrawer";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const OrderSuccess = () => (
  <div className="min-h-screen flex items-center justify-center text-white text-center p-8">
    <div>
      <h1 className="text-3xl font-bold mb-4">🎉 Order Placed Successfully!</h1>
      <p className="text-lg">
        Thank you for your purchase. We'll notify you once it's shipped.
      </p>
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Record<string, Record<string, number>>>(
    {}
  );
  const [jerseysWithStock, setJerseysWithStock] = useState<Jersey[]>([]);
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
  } = useCart();
  const location = useLocation();
  const filterCategory = (location.state as any)?.filterCategory || null;

  // Auth check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth(); // run on mount

    // 🔥 listen for login/logout changes
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Handle browser back button for modal
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isModalOpen && !event.state?.modalOpen) {
        setIsModalOpen(false);
        setSelectedJersey(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isModalOpen]);

  // Fetch stock data
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://jerseybackend.onrender.com/api/stock");
        const data = await res.json();
        if (data.success) {
          const stockMap: Record<string, Record<string, number>> = {};
          data.data.forEach(
            (s: { jerseyId: string; stockBySize: Record<string, number> }) => {
              stockMap[s.jerseyId] = s.stockBySize;
            }
          );
          setStocks(stockMap);
        }
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
      }
    };
    fetchStocks();
  }, []);

  // Merge jerseys with stock
  useEffect(() => {
    const merged = jerseys.map((j) => ({
      ...j,
      stockBySize: stocks[j.id] || {},
    }));
    setJerseysWithStock(merged);
  }, [stocks]);

  const handleViewDetails = (jersey: Jersey) => {
    const enriched =
      jerseysWithStock.find((j) => j.id === jersey.id) || jersey;
    setSelectedJersey(enriched);
    setIsModalOpen(true);
    // Push state to history for back button handling
    window.history.pushState({ modalOpen: true }, '');
  };

  const handleAddToCart = (
    jersey: Jersey,
    size: string,
    quantity: number
  ) => {
    const existingItem = cartItems.find(item => item.jersey.id === jersey.id && item.size === size);
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const availableStock = jersey.stockBySize?.[size] ?? 0;
    const totalRequested = currentCartQuantity + quantity;
    
    if (availableStock === 0) {
      toast.error('This item is out of stock!');
      return;
    }
    
    if (totalRequested > availableStock) {
      const maxAddable = availableStock - currentCartQuantity;
      if (maxAddable <= 0) {
        toast.error(`You already have the maximum available quantity (${availableStock}) in your cart!`);
        return;
      } else {
        toast(`Only ${maxAddable} more can be added. Added ${maxAddable} to cart.`, { icon: '⚠️' });
        addToCart(jersey, size, maxAddable);
        handleCloseModal();
      }
    } else {
      addToCart(jersey, size, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJersey(null);
    // Go back in history if modal was opened
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  const handleSearchClick = () => {
    setShowAdvancedSearch(true);
    setCurrentSection(null);
  };

  const handleViewAllSection = (sectionTitle: string) => {
    setShowAdvancedSearch(true);
    setCurrentSection(sectionTitle);
  };

  const getSectionJerseys = (sectionTitle: string) => {
    switch (sectionTitle) {
      case "New Arrivals":
        return jerseysWithStock.filter(j => j.isNew);
      case "Best Sellers":
        return jerseysWithStock.filter(j => j.isBestSeller);
      case "Country Jerseys":
        return jerseysWithStock.filter(j => j.category === "Country");
      case "Club Jerseys":
        return jerseysWithStock.filter(j => j.category === "Club");
      case "Trending":
        return jerseysWithStock.filter(j => j.isTrending);
      case "Retro Collection":
        return jerseysWithStock.filter(j => j.type === "Retro");
      case "Full Kit":
        return jerseysWithStock.filter(j => j.fullKit);
      case "Player Version":
        return jerseysWithStock.filter(j => j.type === "Player Version");
      /* case "Master Copy":
        return jerseysWithStock.filter(j => j.type === "Master Copy"); */
      case "Master Copy 2nd Version":
        return jerseysWithStock.filter(j => j.type === "Master Copy 2nd Version");
      case "Sublimation":
        return jerseysWithStock.filter(j => j.type === "Sublimation");
      case "LooseFit/FiveSleeve":
        return jerseysWithStock.filter(j => j.isloosefit);
      case "Shorts":
        return jerseysWithStock.filter(j => j.type === "Shorts");
      default:
        return jerseysWithStock;
    }
  };

  const handleBackFromSearch = () => {
    setShowAdvancedSearch(false);
    setSearchQuery("");
    setCurrentSection(null);
  };

  if (isAuthenticated === null) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar
        cartCount={getCartCount()}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        cartTotal={getCartTotal()}
      />
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            showAdvancedSearch ? (
              <AdvancedSearch
                jerseys={jerseysWithStock}
                onViewDetails={handleViewDetails}
                wishlistedItems={wishlist}
                onToggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
                onBack={handleBackFromSearch}
                sectionTitle={currentSection}
              />
            ) : (
              <>
                <Hero
                  onShopNowClick={handleSearchClick}
                  onCustomizeClick={() => console.log("Customize clicked")}
                />
                <StaticCategoryCarousel />

                {/* Category Sections - Reordered as requested */}
                <div id="new-arrivals">
                  <CategorySection
                    title="New Arrivals"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.isNew
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("New Arrivals")}
                  />
                </div>
                
                <div id="player-version">
                  <CategorySection
                    title="Player Version"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.type === "Player Version"
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Player Version")}
                  />
                </div>
                
                <div id="full-kit">
                  <CategorySection
                    title="Full Kit/FC SET"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.fullKit
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Full Kit")}
                  />
                </div>
                
                <div id="master-copy-2nd">
                  <CategorySection
                    title="Master Version 2nd Copy"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.type === "Master Copy 2nd Version"
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Master Copy 2nd Version")}
                  />
                </div>
                
                <div id="sublimation">
                  <CategorySection
                    title="Sublimation"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.type === "Sublimation"
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Sublimation")}
                  />
                </div>
                
                <div id="loose-fit">
                  <CategorySection
                    title="LooseFit/FiveSleeve"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.isloosefit
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("LooseFit/FiveSleeve")}
                  />
                </div>
                
                <div id="retro-collection">
                  <CategorySection
                    title="Retro Collection"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.type === "Retro"
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Retro Collection")}
                  />
                </div>
                
                <div id="best-sellers">
                  <CategorySection
                    title="Best Sellers"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.isBestSeller
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Best Sellers")}
                  />
                </div>
                
                <div id="country-jerseys">
                  <CategorySection
                    title="Country Jerseys"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.category === "Country"
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Country Jerseys")}
                  />
                </div>
                
                <div id="club-jerseys">
                  <CategorySection
                    title="Club Jerseys"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.category === "Club"
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Club Jerseys")}
                  />
                </div>
                
                <div id="trending">
                  <CategorySection
                    title="Trending"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.isTrending
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Trending")}
                  />
                </div>
                
                <div id="shorts">
                  <CategorySection
                    title="Shorts"
                    jerseys={jerseysWithStock.filter(
                      (j) => j.type === "Shorts"
                    )}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    wishlistedItems={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onViewAll={() => handleViewAllSection("Shorts")}
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
            isAuthenticated === null ? (
              <div className="text-center py-20">
                Checking authentication...
              </div>
            ) : isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/signin" state={{ from: "/dashboard" }} replace />
            )
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              cartTotal={getCartTotal()}
              onClearCart={() => {
                localStorage.removeItem("cart");
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
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Floating Cart Icon (Mobile) */}
      <div
        key={getCartCount()}
        className="fixed bottom-4 right-4 z-50 md:hidden group animate-cartPop"
        onClick={() => setIsCartOpen(true)}
      >
        <div
          className="relative flex items-center justify-center w-14 h-14 bg-white text-black rounded-full shadow-xl cursor-pointer 
          hover:animate-none transition-all duration-300 border border-gray-300
          hover:scale-105 hover:ring-2 hover:ring-blue-400"
        >
          🛒
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {getCartCount()}
            </span>
          )}
          <span className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-50 animate-pulse"></span>
        </div>

        <div className="absolute bottom-16 right-0 bg-white text-sm shadow-lg rounded-md w-56 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <p className="font-semibold mb-2 text-black">Cart Preview</p>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-1 max-h-40 overflow-y-auto no-scrollbar text-black">
              {cartItems.slice(0, 3).map((item, idx) => (
                <li key={idx} className="truncate">
                  {item.jersey.club} × {item.quantity}
                </li>
              ))}
              {cartItems.length > 3 && (
                <li className="text-blue-600">
                  + {cartItems.length - 3} more
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        cartTotal={getCartTotal()}
      />

      <Footer />
    </div>
  );
};

export default App;