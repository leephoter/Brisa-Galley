import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Place',
  description:
    'Find our collections at select locations worldwide. Visit us at our partner stores and boutiques. Discover where to shop Brisa Gallery.',
  keywords: ['Brisa locations', 'store locations', 'fashion boutique', 'where to buy', 'stockists'],
  openGraph: {
    title: 'Place | Brisa Gallery',
    description: 'Find our collections at select locations worldwide.',
    url: 'https://brisa-galley.vercel.app/place',
    type: 'website',
    images: ['/images/ogImage.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Place | Brisa Gallery',
    description: 'Find our collections at select locations worldwide.',
    images: ['/images/ogImage.png'],
  },
};

export default function PLACELayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
