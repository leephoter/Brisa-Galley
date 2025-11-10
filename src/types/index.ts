export interface NavigationItem {
  label: string;
  href: string;
  subItems?: NavigationItem[];
}

export interface Collection {
  id: string;
  season: string;
  year: number;
  title: string;
  description?: string;
  imageUrl: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  slug: string;
  inStock: boolean;
}

export interface Stockist {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
}
