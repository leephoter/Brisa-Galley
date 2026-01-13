import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PLACE | Brisa Gallery',
  description:
    'Find our collections at select locations worldwide. Visit us at our partner stores.',
  openGraph: {
    title: 'PLACE | Brisa Gallery',
    description: 'Find our collections at select locations worldwide.',
  },
};

export default function PLACELayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
