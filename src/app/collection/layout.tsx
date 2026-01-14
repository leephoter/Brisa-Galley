import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collection',
  description:
    'Explore our seasonal collections spanning from 2022 to present. Timeless pieces for the modern wardrobe. Contemporary fashion meets classic design.',
  keywords: ['fashion collection', 'seasonal collection', 'modern wardrobe', 'Brisa fashion', 'contemporary design'],
  openGraph: {
    title: 'Collection | Brisa Gallery',
    description: 'Explore our seasonal collections spanning from 2022 to present.',
    url: 'https://brisa-galley.vercel.app/collection',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collection | Brisa Gallery',
    description: 'Explore our seasonal collections spanning from 2022 to present.',
    images: ['/og-image.jpg'],
  },
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
