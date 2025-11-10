import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stockists | Brisa Gallery',
  description:
    'Find our collections at select locations worldwide. Visit us at our partner stores.',
  openGraph: {
    title: 'Stockists | Brisa Gallery',
    description: 'Find our collections at select locations worldwide.',
  },
};

export default function StockistsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
