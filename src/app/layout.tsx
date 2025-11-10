import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brisa Gallery',
  description: 'A modern Brisa gallery inspired by contemporary design',
  keywords: ['Brisa', 'contemporary Brisa', 'clothing', 'style', 'gallery'],
  authors: [{ name: 'Brisa Gallery' }],
  openGraph: {
    title: 'Brisa Gallery',
    description: 'A modern Brisa gallery inspired by contemporary design',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('111!@', 111);
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
