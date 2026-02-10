import { CONSTANTS } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News',
  description:
    'Learn about our story, philosophy, and commitment to timeless design and quality craftsmanship. Discover the vision behind Brisa asia.',
  keywords: [
    'Brisa story',
    'fashion philosophy',
    'timeless design',
    'quality craftsmanship',
    'sustainable fashion',
  ],
  openGraph: {
    title: `News | ${CONSTANTS.BRISA_ASIA}`,
    description: 'Learn about our story, philosophy, and commitment to timeless design.',
    url: `${CONSTANTS.URL}/news`,
    type: 'website',
    images: ['/images/ogImage.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `News | ${CONSTANTS.BRISA_ASIA}`,
    description: 'Learn about our story, philosophy, and commitment to timeless design.',
    images: ['/images/ogImage.png'],
  },
};

export default function NEWSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
