export interface NavigationItem {
  label: React.ReactNode;
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  subItems?: (Omit<NavigationItem, 'href'> & Required<Pick<NavigationItem, 'href'>>)[];
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

export interface Archive {
  id: string;
  season: string;
  year: number;
  title: string;
  description?: string;
  slug: string;
  images: string[];
  // Supabase additional fields
  created_at?: string;
  updated_at?: string;
  is_published?: boolean;
}

// Supabase table type
export interface ArchiveTable {
  id: string;
  season: string;
  year: number;
  title: string;
  description: string | null;
  slug: string;
  image_order: string[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_published: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}
