import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (jerseyId: string) => {
    setWishlist(prev => 
      prev.includes(jerseyId)
        ? prev.filter(id => id !== jerseyId)
        : [...prev, jerseyId]
    );
  };

  const isWishlisted = (jerseyId: string) => wishlist.includes(jerseyId);

  return {
    wishlist,
    toggleWishlist,
    isWishlisted
  };
};