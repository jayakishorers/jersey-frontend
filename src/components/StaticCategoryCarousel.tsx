import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { label: 'New Arrivals', targetId: 'new-arrivals', image: "/new-arrival.jpeg" },
  { label: 'Best Sellers', targetId: 'best-sellers', image: "/bestseller.jpeg" },
  { label: 'Country Jerseys', targetId: 'country-jerseys', image: "/country.avif" },
  { label: 'Club Jerseys', targetId: 'club-jerseys', image: "/club.jpeg" },
  { label: 'Trending', targetId: 'trending', image: "/trending.jpeg" },
  { label: 'Retro Collection', targetId: 'retro-collection', image: "/retro.webp" },
  { label: 'Full Kit', targetId: 'full-kit', image: "/fullkit.jpeg" },
  { label: 'Player Version', targetId: 'player-version', image: "/playerversion.jpeg" },
  { label: 'Full Sleeve', targetId: 'full-sleeve', image: "/fullsleeve.webp" },
  { label: 'Master Copy', targetId: 'master-copy', image: "/mastercopy.jpeg" },
  { label: 'Sublimation', targetId: 'sublimation', image: "/sublimation.jpeg" },
  { label: 'Cricket', targetId: 'cricket', image: "/cricket.jpeg" },
];

export const StaticCategoryCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToSection = (label: string) => {
    const sectionMap: Record<string, string> = {
      'New Arrivals': 'new-arrivals',
      'Best Sellers': 'best-sellers',
      'Country Jerseys': 'country-jerseys',
      'Club Jerseys': 'club-jerseys',
      'Trending': 'trending',
      'Retro Collection': 'retro-collection',
      'Full Kit': 'full-kit',
      'Full Sleeve': 'full-sleeve',
      'Master Copy': 'master-copy',
      'Player Version': 'player-version',
      'Sublimation': 'sublimation',
      'Cricket': 'cricket',
    };
    const element = document.getElementById(sectionMap[label]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[url('https://images.unsplash.com/photo-1603808033192-082d6919d7b8?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center py-6 px-4 sm:px-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white text-center drop-shadow">
        Shop by Categories
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-10 py-4"
        >
          {categories.map((category, index) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    key={index}
    className="min-w-[140px] sm:min-w-[180px] bg-white text-black rounded-xl shadow-md p-3 text-center cursor-pointer whitespace-nowrap"
    onClick={() => scrollToSection(category.label)}
  >
    <img
      src={category.image}
      alt={category.label}
      className="mx-auto mb-2 h-20 w-20 sm:h-40 sm:w-40 rounded-lg object-cover"
    />
    <div className="font-semibold text-sm sm:text-base">{category.label}</div>
  </motion.div>
))}

        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
