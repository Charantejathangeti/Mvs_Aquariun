import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Live Fish
  {
    id: 'f1',
    name: 'Milk White OHM Betta',
    category: 'Live Fish',
    price: 120,
    weight: 30,
    stockCount: 15,
    image: 'https://picsum.photos/400/400?random=1',
    description: 'Elegant Milk White Over Half Moon Betta.'
  },
  {
    id: 'f2',
    name: 'Molly Pair',
    category: 'Live Fish',
    price: 25,
    weight: 40,
    stockCount: 8, // Limited Stock Trigger
    image: 'https://picsum.photos/400/400?random=2',
    description: 'Active and healthy Molly pair.'
  },
  {
    id: 'f3',
    name: 'Baby Flower Horn',
    category: 'Live Fish',
    price: 120,
    weight: 80,
    stockCount: 0, // No Stock Trigger
    image: 'https://picsum.photos/400/400?random=3',
    description: 'High potential baby Flower Horn.'
  },
  {
    id: 'f4',
    name: 'Guppy Trio (Exotic)',
    category: 'Live Fish',
    price: 150,
    weight: 30,
    stockCount: 50,
    image: 'https://picsum.photos/400/400?random=4'
  },
  // Supplies
  {
    id: 's1',
    name: 'Royal Food',
    category: 'Supplies',
    price: 110,
    weight: 150,
    stockCount: 100,
    image: 'https://picsum.photos/400/400?random=5',
    description: 'Premium nutrition pellets.'
  },
  {
    id: 's2',
    name: 'Air Pump One Way',
    category: 'Supplies',
    price: 99,
    weight: 250,
    stockCount: 20,
    image: 'https://picsum.photos/400/400?random=6',
    description: 'Silent operation single outlet pump.'
  },
  {
    id: 's3',
    name: 'Foxtail Plant Bunch',
    category: 'Supplies',
    price: 50,
    weight: 50,
    stockCount: 5,
    image: 'https://picsum.photos/400/400?random=7',
    description: 'Live aquatic plant, great for fry hiding.'
  }
];