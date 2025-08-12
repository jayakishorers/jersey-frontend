export interface Jersey {
  id: string;
  name: string;
  club: string;
  country?: string;
  type: 'Player Version' | 'Master Copy' | 'Sublimation' | 'Retro' | 'Full Sleeve' | 'Full Kit';
  material: 'Polyester' | 'Mesh' | 'Dri-FIT' | 'Cotton';
  category: 'Club' | 'Country' | 'Cricket';
  fullKit: boolean;
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  price: number;
  isFullSleeve?:boolean;
  originalPrice?: number;
  rating?: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  stock?: number;
  discount?: number;
  PlayerName?:String;
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
  sortBy: string;
  priceRange: [number, number];
  rating: number;
}

export type ViewMode = 'home' | 'search' | 'customize' | 'cart';