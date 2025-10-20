import React, { useRef, useEffect, useState } from 'react';
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
  /* { label: 'Master Copy', targetId: 'master-copy', image: "/mastercopy.jpeg" }, */
  { label: 'Sublimation', targetId: 'sublimation', image: "/sublimation.jpeg" },
  { label: 'LooseFit/FiveSleeve', targetId: 'loose-fit', image: "/playerversion.jpeg" },
];

export const StaticCategoryCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const duplicatedCategories = [...categories, ...categories, ...categories];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      setIsAutoScrolling(false);
      const cardWidth = 160;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => setIsAutoScrolling(true), 3000);
    }
  };
  
  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const smoothScroll = () => {
      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const currentScroll = scrollRef.current.scrollLeft;
        
        if (currentScroll >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          scrollRef.current.scrollLeft += 2.25;
        }
        
        setScrollPosition(scrollRef.current.scrollLeft);
      }
    };
    
    const interval = setInterval(smoothScroll, 33);
    return () => clearInterval(interval);
  }, [isAutoScrolling]);
  
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

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
      /* 'Master Copy': 'master-copy', */
      'Sublimation': 'sublimation',
      'LooseFit/FiveSleeve': 'loose-fit',
    };
    const element = document.getElementById(sectionMap[label]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-6 px-4" style={{
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
    }}>
      {/* Subtle Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={`bg-circle-${index}`}
            className="absolute rounded-full border border-gray-200/30"
            style={{
              left: `${(index * 20 + 10) % 90}%`,
              top: `${(index * 15 + 20) % 60}%`,
              width: `${60 + index * 20}px`,
              height: `${60 + index * 20}px`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 15 + index * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white text-center relative z-10">
        Shop by Categories
      </h2>
      
      <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
        >
          <ChevronLeft size={20} />
        </motion.button>
        
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar px-8 py-4"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <motion.div
              key={`${category.label}-${index}`}
              className="w-[160px] h-[160px] cursor-pointer flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(category.label)}
            >
              <div className="w-full h-full bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md border border-white/50 relative">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white text-gray-800 font-medium text-xs py-1 px-2 text-center">
                  {category.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
};