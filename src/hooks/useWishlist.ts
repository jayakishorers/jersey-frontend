import { useState, useCallback } from 'react';

export const useWishlist = () => {
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);

  const toggleWishlist = useCallback((jerseyId: string) => {
    setWishlistedItems(prev => {
      if (prev.includes(jerseyId)) {
        return prev.filter(id => id !== jerseyId);
      } else {
        return [...prev, jerseyId];
      }
    });
  }, []);

  const isWishlisted = useCallback((jerseyId: string) => {
    return wishlistedItems.includes(jerseyId);
  }, [wishlistedItems]);

  return {
    wishlistedItems,
    toggleWishlist,
    isWishlisted
  };
};