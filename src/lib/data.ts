import { Collection, Product, Stockist } from '@/types';

export const collections: Collection[] = [
  {
    id: '1',
    season: 'AUTUMN / WINTER',
    year: 2025,
    title: '2025 AW',
    description: 'The latest collection celebrating contemporary minimalism and timeless design.',
    imageUrl: '/images/collections/2025-aw.jpg',
    slug: '2025-aw',
  },
  {
    id: '2',
    season: 'SPRING / SUMMER',
    year: 2025,
    title: '2025 SS',
    description: 'Light and airy designs for the warmer seasons.',
    imageUrl: '/images/collections/2025-ss.jpg',
    slug: '2025-ss',
  },
];

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find((collection) => collection.slug === slug);
};

export const getLatestCollection = (): Collection => {
  return collections[0];
};

// Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Wool Coat',
    price: 45000,
    description:
      'A timeless wool coat crafted from premium materials. Features a relaxed fit and minimalist design that transcends seasons.',
    images: ['/images/products/coat-1-1.jpg', '/images/products/coat-1-2.jpg'],
    category: 'Outerwear',
    slug: 'classic-wool-coat',
    inStock: true,
  },
  {
    id: '2',
    name: 'Cotton Oxford Shirt',
    price: 18000,
    description:
      'Essential oxford shirt in premium cotton. Clean lines and perfect proportions make this a wardrobe staple.',
    images: ['/images/products/shirt-1-1.jpg', '/images/products/shirt-1-2.jpg'],
    category: 'Shirts',
    slug: 'cotton-oxford-shirt',
    inStock: true,
  },
  {
    id: '3',
    name: 'Tailored Trousers',
    price: 28000,
    description:
      'Impeccably tailored trousers with a modern silhouette. Crafted from high-quality fabric for comfort and durability.',
    images: ['/images/products/trousers-1-1.jpg', '/images/products/trousers-1-2.jpg'],
    category: 'Bottoms',
    slug: 'tailored-trousers',
    inStock: true,
  },
  {
    id: '4',
    name: 'Cashmere Knit',
    price: 35000,
    description: 'Luxurious cashmere knit with a refined finish. Soft, warm, and designed to last.',
    images: ['/images/products/knit-1-1.jpg', '/images/products/knit-1-2.jpg'],
    category: 'Knitwear',
    slug: 'cashmere-knit',
    inStock: true,
  },
  {
    id: '5',
    name: 'Denim Jacket',
    price: 32000,
    description:
      'Classic denim jacket with contemporary updates. Versatile piece that works with any wardrobe.',
    images: ['/images/products/jacket-1-1.jpg', '/images/products/jacket-1-2.jpg'],
    category: 'Outerwear',
    slug: 'denim-jacket',
    inStock: false,
  },
  {
    id: '6',
    name: 'Linen Shirt',
    price: 22000,
    description:
      'Breathable linen shirt perfect for warmer weather. Relaxed fit with attention to detail.',
    images: ['/images/products/shirt-2-1.jpg', '/images/products/shirt-2-2.jpg'],
    category: 'Shirts',
    slug: 'linen-shirt',
    inStock: true,
  },
  {
    id: '7',
    name: 'Wool Trousers',
    price: 32000,
    description:
      'Premium wool trousers with a refined cut. Essential piece for any sophisticated wardrobe.',
    images: ['/images/products/trousers-2-1.jpg', '/images/products/trousers-2-2.jpg'],
    category: 'Bottoms',
    slug: 'wool-trousers',
    inStock: true,
  },
  {
    id: '8',
    name: 'Merino Sweater',
    price: 28000,
    description: 'Lightweight merino wool sweater. Perfect layering piece with timeless appeal.',
    images: ['/images/products/sweater-1-1.jpg', '/images/products/sweater-1-2.jpg'],
    category: 'Knitwear',
    slug: 'merino-sweater',
    inStock: true,
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category);
};

export const categories = ['All', 'Outerwear', 'Shirts', 'Bottoms', 'Knitwear'] as const;

// Stockists
export const stockists: Stockist[] = [
  {
    id: '1',
    name: 'Brisa Gallery Seoul',
    address: '123 Gangnam-daero, Gangnam-gu',
    city: 'Seoul',
    country: 'South Korea',
    phone: '+82-2-1234-5678',
    email: 'seoul@Brisagallery.com',
  },
  {
    id: '2',
    name: 'Brisa Gallery Busan',
    address: '456 Haeundae-ro, Haeundae-gu',
    city: 'Busan',
    country: 'South Korea',
    phone: '+82-51-9876-5432',
    email: 'busan@Brisagallery.com',
  },
  {
    id: '3',
    name: 'Brisa Gallery Tokyo',
    address: '7-8-9 Shibuya, Shibuya-ku',
    city: 'Tokyo',
    country: 'Japan',
    phone: '+81-3-1234-5678',
    email: 'tokyo@Brisagallery.com',
  },
  {
    id: '4',
    name: 'Brisa Gallery New York',
    address: '789 5th Avenue',
    city: 'New York',
    country: 'United States',
    phone: '+1-212-555-1234',
    email: 'newyork@Brisagallery.com',
  },
  {
    id: '5',
    name: 'Brisa Gallery London',
    address: '456 Bond Street',
    city: 'London',
    country: 'United Kingdom',
    phone: '+44-20-1234-5678',
    email: 'london@Brisagallery.com',
  },
  {
    id: '6',
    name: 'Brisa Gallery Paris',
    address: '123 Rue Saint-Honoré',
    city: 'Paris',
    country: 'France',
    phone: '+33-1-2345-6789',
    email: 'paris@Brisagallery.com',
  },
];
