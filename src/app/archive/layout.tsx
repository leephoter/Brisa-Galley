import { CONSTANTS } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive',
  description:
    'Discover our curated selection of manswear archive. High-quality pieces designed to last. Browse timeless designs and modern collections.',
  keywords: ['fashion archive', 'manswear', 'Brisa collection', 'timeless design'],
  openGraph: {
    title: `Archive | ${CONSTANTS.BRISA_ASIA}`,
    description: 'Discover our curated selection of manswear archive.',
    url: `${CONSTANTS.URL}/archive`,
    type: 'website',
    images: ['/images/ogImage.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Archive | ${CONSTANTS.BRISA_ASIA}`,
    description: 'Discover our curated selection of manswear archive.',
    images: ['/images/ogImage.png'],
  },
};

export default function ARCHIVELayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
