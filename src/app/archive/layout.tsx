import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive',
  description:
    'Discover our curated selection of contemporary fashion archive. High-quality pieces designed to last. Browse timeless designs and modern collections.',
  keywords: ['fashion archive', 'contemporary fashion', 'Brisa collection', 'timeless design'],
  openGraph: {
    title: 'Archive | Brisa Gallery',
    description: 'Discover our curated selection of contemporary fashion archive.',
    url: 'https://brisa-galley.vercel.app/archive',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Archive | Brisa Gallery',
    description: 'Discover our curated selection of contemporary fashion archive.',
    images: ['/og-image.jpg'],
  },
};

export default function ARCHIVELayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
