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
  label?: string; // Custom name for header menu
  description?: string;
  slug: string;
  images: string[];
  // Supabase additional fields
  created_at?: string;
  updated_at?: string;
  is_published?: boolean;
  display_order?: number;
}

// Supabase table type
export interface ArchiveTable {
  id: string;
  season: string;
  year: number;
  title: string;
  label: string | null;
  description: string | null;
  slug: string;
  image_order: string[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_published: boolean;
  display_order: number;
}

export type UserRole = 'master' | 'manager';

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Page {
  id: string;
  page_key: 'place' | 'news' | 'call';
  title: string;
  label?: string;
  description?: string;
  slug: string;
  content?: string;
  is_published?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}
