import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Brisa Gallery',
  description:
    'Learn about our story, philosophy, and commitment to timeless design and quality craftsmanship.',
  openGraph: {
    title: 'About | Brisa Gallery',
    description: 'Learn about our story, philosophy, and commitment to timeless design.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
