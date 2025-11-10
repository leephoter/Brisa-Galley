import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop | Brisa Gallery',
  description:
    'Discover our curated selection of contemporary Brisa. High-quality pieces designed to last.',
  openGraph: {
    title: 'Shop | Brisa Gallery',
    description: 'Discover our curated selection of contemporary Brisa.',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
