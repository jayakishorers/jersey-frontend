import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const staticCategories = [
  {
    title: 'SEASON 25/26',
    image: '/assets/categories/season.jpg',
    sectionId: 'season',
  },
  {
    title: "Kid's Collection",
    image: '/assets/categories/kids.jpg',
    sectionId: 'kids',
  },
  {
    title: 'Vintage Retro Kits',
    image: '/assets/categories/vintage.jpg',
    sectionId: 'vintage',
  },
  {
    title: 'Cricket',
    image: '/assets/categories/cricket.jpg',
    sectionId: 'cricket',
  },
  {
    title: 'NBA',
    image: '/assets/categories/nba.jpg',
    sectionId: 'nba',
  },
];

export const StaticCategoryCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
const autoScrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isHovered, setIsHovered] = useState(false);

  // Auto scroll effect
  useEffect(() => {
  const startAutoScroll = () => {
    autoScrollInterval.current = setInterval(() => {
      if (scrollRef.current && !isHovered) {
        scrollRef.current.scrollBy({ left: 1.5, behavior: 'smooth' });
      }
    }, 16);
  };

  startAutoScroll();

  return () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };
}, [isHovered]);


  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="py-10 relative bg-white/70 backdrop-blur-md border-y border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center"
        >
          Shop by Categories
        </motion.h2>

        {/* Left Button */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-blue-500 text-gray-700 hover:text-white p-2 rounded-full shadow transition ${
            isHovered ? 'block' : 'hidden'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar scroll-smooth cursor-pointer"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          {staticCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => scrollToSection(category.sectionId)}
              className="relative flex-shrink-0 w-48 h-28 sm:w-64 sm:h-36 rounded-xl overflow-hidden shadow-md border border-gray-300 hover:shadow-lg transition"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm sm:text-base font-semibold text-center py-2">
                {category.title}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-blue-500 text-gray-700 hover:text-white p-2 rounded-full shadow transition ${
            isHovered ? 'block' : 'hidden'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
