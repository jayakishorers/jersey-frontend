import { Jersey } from '../types';

export interface Jersey {
  id: string;
  name: string;
  club: string;
  country?: string;
  type: 'Player Version' | 'Master Copy' | 'Sublimation' | 'Retro' | 'Full Sleeve' | 'Full Kit';
  material: 'Polyester' | 'Mesh' | 'Dri-FIT' | 'Cotton';
  category: 'Club' | 'Country';
  fullKit: boolean;
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  stock: number;
  discount?: number;
}

export const jerseys: Jersey[] = [
  {
    id: '1',
    name: 'Manchester United Home Jersey 2024',
    club: 'Manchester United',
    type: 'Player Version',
    material: 'Dri-FIT',
    category: 'Club',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.8,
    reviews: 324,
    stock: 50,
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Official Manchester United home jersey with premium Dri-FIT technology.',
    features: ['Moisture-wicking fabric', 'Authentic club crest', 'Slim fit design'],
    isNew: true,
    isBestSeller: true,
    discount: 18
  },
  {
    id: '2',
    name: 'Brazil National Team Jersey 2024',
    club: 'Brazil',
    country: 'Brazil',
    type: 'Master Copy',
    material: 'Polyester',
    category: 'Country',
    fullKit: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 75.99,
    rating: 4.9,
    reviews: 278,
    image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Official Brazil national team jersey with shorts and socks included.',
    features: ['Complete kit included', 'Premium polyester blend', 'National team emblem'],
    isTrending: true
  },
  {
    id: '3',
    name: 'Real Madrid Away Jersey 2024',
    club: 'Real Madrid',
    type: 'Sublimation',
    material: 'Mesh',
    category: 'Club',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL'],
    price: 94.99,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Real Madrid away jersey with sublimation printing technology.',
    features: ['Sublimation print', 'Breathable mesh fabric', 'Champions League badges'],
    isBestSeller: true
  },
  {
    id: '4',
    name: 'Barcelona Retro 1992 Jersey',
    club: 'FC Barcelona',
    type: 'Retro',
    material: 'Cotton',
    category: 'Club',
    fullKit: false,
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 69.99,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Classic Barcelona retro jersey from the legendary 1992 season.',
    features: ['Vintage design', '100% cotton fabric', 'Retro club badge'],
    isNew: true
  },
  {
    id: '5',
    name: 'Argentina World Cup Jersey 2022',
    club: 'Argentina',
    country: 'Argentina',
    type: 'Player Version',
    material: 'Dri-FIT',
    category: 'Country',
    fullKit: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 99.99,
    rating: 5.0,
    reviews: 445,
    image: 'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'World Cup winning Argentina jersey with complete kit.',
    features: ['World Cup winners edition', 'Complete kit', 'Premium Dri-FIT'],
    isBestSeller: true,
    isTrending: true
  },
  {
    id: '6',
    name: 'PSG Home Long Sleeve Jersey',
    club: 'Paris Saint-Germain',
    type: 'Full Sleeve',
    material: 'Polyester',
    category: 'Club',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 84.99,
    rating: 4.5,
    reviews: 203,
    image: 'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'PSG home jersey with full sleeves for premium comfort.',
    features: ['Long sleeve design', 'Club sponsors included', 'Comfortable fit']
  },
  {
    id: '7',
    name: 'Liverpool Third Kit 2024',
    club: 'Liverpool FC',
    type: 'Full Kit',
    material: 'Mesh',
    category: 'Club',
    fullKit: true,
    sizes: ['S', 'M', 'L', 'XL'],
    price: 119.99,
    rating: 4.8,
    reviews: 267,
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Complete Liverpool third kit with jersey, shorts, and socks.',
    features: ['Complete kit set', 'Premium mesh fabric', 'Third kit design'],
    isNew: true
  },
  {
    id: '8',
    name: 'Germany National Team Away',
    club: 'Germany',
    country: 'Germany',
    type: 'Master Copy',
    material: 'Dri-FIT',
    category: 'Country',
    fullKit: false,
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 79.99,
    rating: 4.7,
    reviews: 198,
    image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Germany national team away jersey with advanced fabric technology.',
    features: ['National team official', 'Advanced Dri-FIT', 'Away kit design']
  },
  {
    id: '9',
    name: 'Chelsea Vintage 1970 Jersey',
    club: 'Chelsea FC',
    type: 'Retro',
    material: 'Cotton',
    category: 'Club',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL'],
    price: 64.99,
    rating: 4.4,
    reviews: 134,
    image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Classic Chelsea jersey from the iconic 1970 era.',
    features: ['Vintage 1970 design', 'Pure cotton fabric', 'Classic blue color'],
    isTrending: true
  },
  {
    id: '10',
    name: 'AC Milan Home Jersey 2024',
    club: 'AC Milan',
    type: 'Player Version',
    material: 'Polyester',
    category: 'Club',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 87.99,
    rating: 4.6,
    reviews: 221,
    image: 'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'AC Milan home jersey with traditional red and black stripes.',
    features: ['Classic rossoneri design', 'Premium polyester', 'Official club jersey']
  },
  {
    id: '11',
    name: 'France National Team Home',
    club: 'France',
    country: 'France',
    type: 'Sublimation',
    material: 'Mesh',
    category: 'Country',
    fullKit: true,
    sizes: ['S', 'M', 'L', 'XL'],
    price: 92.99,
    rating: 4.9,
    reviews: 312,
    image: 'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'France national team home jersey with complete kit.',
    features: ['Complete national kit', 'Sublimation technology', 'Les Bleus design'],
    isBestSeller: true
  },
  {
    id: '12',
    name: 'Inter Milan Long Sleeve Away',
    club: 'Inter Milan',
    type: 'Full Sleeve',
    material: 'Dri-FIT',
    category: 'Club',
    fullKit: false,
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 91.99,
    rating: 4.5,
    reviews: 167,
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Inter Milan away jersey with full sleeves and premium fabric.',
    features: ['Long sleeve design', 'Away kit colors', 'Dri-FIT technology']
  },
  {
    id: '13',
    name: 'Spain Euro 2024 Kit',
    club: 'Spain',
    country: 'Spain',
    type: 'Full Kit',
    material: 'Polyester',
    category: 'Country',
    fullKit: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 104.99,
    rating: 4.8,
    reviews: 289,
    image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Complete Spain Euro 2024 kit with jersey, shorts, and socks.',
    features: ['Euro 2024 edition', 'Complete kit included', 'La Roja colors'],
    isNew: true
  },
  {
    id: '14',
    name: 'Arsenal Retro 1989 Jersey',
    club: 'Arsenal FC',
    type: 'Retro',
    material: 'Cotton',
    category: 'Club',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL'],
    price: 71.99,
    rating: 4.3,
    reviews: 145,
    image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Arsenal retro jersey from the legendary 1989 championship season.',
    features: ['1989 championship edition', 'Vintage cotton fabric', 'Classic gunners design']
  },
  {
    id: '15',
    name: 'Juventus Home Sublimation',
    club: 'Juventus FC',
    type: 'Sublimation',
    material: 'Mesh',
    category: 'Club',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 88.99,
    rating: 4.7,
    reviews: 234,
    image: 'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Juventus home jersey with sublimation printing and mesh fabric.',
    features: ['Sublimation printing', 'Breathable mesh', 'Black and white stripes'],
    isTrending: true
  },
  {
    id: '16',
    name: 'England World Cup Kit 2022',
    club: 'England',
    country: 'England',
    type: 'Master Copy',
    material: 'Dri-FIT',
    category: 'Country',
    fullKit: true,
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 96.99,
    rating: 4.6,
    reviews: 201,
    image: 'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'England World Cup 2022 complete kit with advanced fabric.',
    features: ['World Cup 2022', 'Three Lions crest', 'Complete kit set']
  },
  {
    id: '17',
    name: 'Bayern Munich Long Sleeve',
    club: 'Bayern Munich',
    type: 'Full Sleeve',
    material: 'Polyester',
    category: 'Club',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL'],
    price: 83.99,
    rating: 4.5,
    reviews: 178,
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Bayern Munich long sleeve jersey with premium polyester fabric.',
    features: ['Long sleeve comfort', 'FCB logo', 'Bavarian red color']
  },
  {
    id: '18',
    name: 'Netherlands Away Jersey 2024',
    club: 'Netherlands',
    country: 'Netherlands',
    type: 'Player Version',
    material: 'Mesh',
    category: 'Country',
    fullKit: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    price: 81.99,
    rating: 4.4,
    reviews: 156,
    image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Netherlands away jersey with premium mesh fabric technology.',
    features: ['Oranje away design', 'Mesh breathability', 'National team official']
  },
  {
    id: '19',
    name: 'Tottenham Third Kit 2024',
    club: 'Tottenham Hotspur',
    type: 'Full Kit',
    material: 'Dri-FIT',
    category: 'Club',
    fullKit: true,
    sizes: ['S', 'M', 'L', 'XL'],
    price: 112.99,
    rating: 4.7,
    reviews: 193,
    image: 'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/2834914/pexels-photo-2834914.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Complete Tottenham third kit with jersey, shorts, and socks.',
    features: ['Complete third kit', 'Spurs cockerel logo', 'Dri-FIT technology'],
    isNew: true
  },
  {
    id: '20',
    name: 'Portugal Euro Retro 2004',
    club: 'Portugal',
    country: 'Portugal',
    type: 'Retro',
    material: 'Cotton',
    category: 'Country',
    fullKit: false,
    sizes: ['M', 'L', 'XL', 'XXL'],
    price: 67.99,
    rating: 4.8,
    reviews: 167,
    image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Portugal retro jersey from Euro 2004 home tournament.',
    features: ['Euro 2004 retro', 'Home tournament edition', 'Portuguese heritage'],
    isBestSeller: true
  }
];

export const categories = {
  types: ['Player Version', 'Master Copy', 'Sublimation', 'Retro', 'Full Sleeve', 'Full Kit'],
  materials: ['Polyester', 'Mesh', 'Dri-FIT', 'Cotton'],
  categories: ['Club', 'Country'],
  sizes: ['S', 'M', 'L', 'XL', 'XXL']
};