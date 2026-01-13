import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEWS | Brisa Gallery',
  description:
    'Learn NEWS our story, philosophy, and commitment to timeless design and quality craftsmanship.',
  openGraph: {
    title: 'NEWS | Brisa Gallery',
    description: 'Learn NEWS our story, philosophy, and commitment to timeless design.',
  },
};

export default function NEWSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
