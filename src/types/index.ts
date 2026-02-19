export interface Jersey {
  id: string;
  name: string;
  club: string;
  country?: string;
  type:  | 'Master Copy' | 'Sublimation' | 'Retro' | 'Full Kit'|'Player Version'|'Shorts'|'Master Copy 1st Version';
  material: 'Polyester' | 'Mesh' | 'Dri-FIT' | 'Cotton'|'DotKnit cloth';
  category: 'Club' | 'Country' ;
  fullKit: boolean;
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  price: number;
  isFullSleeve?:boolean;
  originalPrice?: number;
  rating?: number;
  image: string;
  thumbnail?: string; // Low-quality preview image
  images: string[];
  description: string;
  features: string[];
  isNew?: boolean;
  isloosefit?:true;
  isBestSeller?: boolean;
  isTrending?: boolean;
  stock?: number;
  discount?: number;
  PlayerName?:String;
  stockBySize?: Record<string, number>;
  
  // Helper function to get display image (thumbnail if available, otherwise original)
  getDisplayImage?(): string;
}

export interface CartItem {
  id: string;
  jersey: Jersey;
  size: string;
  quantity: number;
  addedAt: Date;
}

export interface FilterState {
  type: string[];
  material: string[];
  category: string[];
  fullKit: string;
  size: string[];
  fullSleeve: boolean;  
  sortBy: string;
  priceRange: [number, number];
  rating: number;
  loosefit: string[];
}

export type ViewMode = 'home' | 'search' | 'customize' | 'cart';