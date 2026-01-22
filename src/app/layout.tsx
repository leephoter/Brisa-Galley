import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://brisa-galley.vercel.app'),
  title: {
    default: 'Brisa Gallery - Contemporary Fashion & Design',
    template: '%s | Brisa Gallery',
  },
  description: 'BRISA / SANG UN - Contemporary fashion gallery showcasing modern design collections, archive pieces, and artistic exhibitions since 2025.',
  keywords: [
    'Brisa',
    'SANG UN',
    'contemporary fashion',
    'fashion gallery',
    'modern design',
    'clothing collection',
    'fashion archive',
    'Korean fashion',
    'style gallery',
    'fashion exhibition',
  ],
  authors: [{ name: 'Brisa Gallery', url: 'https://brisa-galley.vercel.app' }],
  creator: 'Brisa Gallery',
  publisher: 'Brisa Gallery',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://brisa-galley.vercel.app',
    siteName: 'Brisa Gallery',
    title: 'Brisa Gallery - Contemporary Fashion & Design',
    description: 'BRISA / SANG UN - Contemporary fashion gallery showcasing modern design collections, archive pieces, and artistic exhibitions since 2025.',
    images: [
      {
        url: '/images/ogImage.png',
        width: 1200,
        height: 630,
        alt: 'Brisa Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brisa Gallery - Contemporary Fashion & Design',
    description: 'BRISA / SANG UN - Contemporary fashion gallery showcasing modern design collections, archive pieces, and artistic exhibitions since 2025.',
    images: ['/images/ogImage.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console에서 받은 verification code를 여기에 추가
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Brisa Gallery',
    alternateName: 'BRISA / SANG UN',
    url: 'https://brisa-galley.vercel.app',
    logo: 'https://brisa-galley.vercel.app/logo.png',
    description: 'Contemporary fashion gallery showcasing modern design collections, archive pieces, and artistic exhibitions since 2025.',
    foundingDate: '2025',
    sameAs: [
      // Instagram URL이 있다면 여기에 추가
    ],
  };

  return (
    <html lang='ko' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
