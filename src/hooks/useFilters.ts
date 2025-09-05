import { useState, useMemo } from 'react';
import { Jersey } from '../types';

interface FilterState {
  type: string[];
  fullKit: string;
  fullSleeve: boolean;   // 👈 added
  size: string[];
  sortBy: string;
}

export const useFilters = (jerseys: Jersey[]) => {
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    fullKit: '',
    fullSleeve: false, // 👈 default off
    size: [],
    sortBy: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedJerseys = useMemo(() => {
    let filtered = jerseys.filter(jersey => {
      // 🔍 Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          jersey.name.toLowerCase().includes(searchLower) ||
          jersey.club.toLowerCase().includes(searchLower) ||
          jersey.type.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // 🎽 Type filter
      if (filters.type.length > 0 && !filters.type.includes(jersey.type)) {
        return false;
      }

      // 👕 Full Kit filter
      // 👕 Full Kit filter
if (filters.fullKit === 'yes' && !jersey.fullKit) return false;

// 👕 Full Sleeve filter
if (filters.fullSleeve && !jersey.isFullSleeve) return false;

      // 📏 Size filter
      if (filters.size.length > 0) {
        const hasMatchingSize = filters.size.some(size =>
          jersey.sizes.includes(size as any)
        );
        if (!hasMatchingSize) return false;
      }

      return true;
    });

    // ↕️ Sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'newest':
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          case 'bestseller':
            return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [jerseys, filters, searchQuery]);

  return {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredJerseys: filteredAndSortedJerseys
  };
};
