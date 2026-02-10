import { CONSTANTS } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Place',
  description:
    'Find our collections at select locations worldwide. Visit us at our partner stores and boutiques. Discover where to shop Brisa asia.',
  keywords: ['Brisa locations', 'store locations', 'fashion boutique', 'where to buy', 'stockists'],
  openGraph: {
    title: `Place | ${CONSTANTS.BRISA_ASIA}`,
    description: 'Find our collections at select locations worldwide.',
    url: `${CONSTANTS.URL}/place`,
    type: 'website',
    images: ['/images/ogImage.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Place | ${CONSTANTS.BRISA_ASIA}`,
    description: 'Find our collections at select locations worldwide.',
    images: ['/images/ogImage.png'],
  },
};

export default function PLACELayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
