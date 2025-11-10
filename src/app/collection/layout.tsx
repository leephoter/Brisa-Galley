import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections | Brisa Gallery',
  description:
    'Explore our seasonal collections spanning from 2022 to present. Timeless pieces for the modern wardrobe.',
  openGraph: {
    title: 'Collections | Brisa Gallery',
    description: 'Explore our seasonal collections spanning from 2022 to present.',
  },
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
