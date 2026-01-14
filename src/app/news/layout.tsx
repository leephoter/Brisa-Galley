import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News',
  description:
    'Learn about our story, philosophy, and commitment to timeless design and quality craftsmanship. Discover the vision behind Brisa Gallery.',
  keywords: ['Brisa story', 'fashion philosophy', 'timeless design', 'quality craftsmanship', 'sustainable fashion'],
  openGraph: {
    title: 'News | Brisa Gallery',
    description: 'Learn about our story, philosophy, and commitment to timeless design.',
    url: 'https://brisa-galley.vercel.app/news',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News | Brisa Gallery',
    description: 'Learn about our story, philosophy, and commitment to timeless design.',
    images: ['/og-image.jpg'],
  },
};

export default function NEWSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
