import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ARCHIVE | Brisa Gallery',
  description:
    'Discover our curated selection of contemporary Brisa. High-quality pieces designed to last.',
  openGraph: {
    title: 'ARCHIVE | Brisa Gallery',
    description: 'Discover our curated selection of contemporary Brisa.',
  },
};

export default function ARCHIVELayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
