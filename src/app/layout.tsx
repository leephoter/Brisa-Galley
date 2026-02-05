import type { Metadata } from 'next';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import { PageDataProvider } from '@/contexts/PageDataContext';
import './globals.css';
import packageJson from '../../package.json';

const APP_VERSION = packageJson.version;

export const metadata: Metadata = {
  metadataBase: new URL('https://brisa.asia'),
  title: {
    default: 'Brisa asia - Contemporary Fashion & Design',
    template: '%s | Brisa asia',
  },
  description:
    'BRISA / SANG UN - Contemporary fashion gallery showcasing modern design collections, archive pieces, and artistic exhibitions since 2025.',
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
  authors: [{ name: 'Brisa asia', url: 'https://brisa.asia' }],
  creator: 'Brisa asia',
  publisher: 'Brisa asia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://brisa.asia',
    siteName: 'Brisa asia',
    title: 'Brisa asia - Contemporary Fashion & Design',
    description:
      'BRISA / SANG UN - Contemporary fashion gallery showcasing modern design collections, archive pieces, and artistic exhibitions since 2025.',
    images: [
      {
        url: '/images/ogImage.png',
        width: 1200,
        height: 630,
        alt: 'Brisa asia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brisa asia - Contemporary Fashion & Design',
    description:
      'BRISA / SANG UN - Contemporary fashion gallery showcasing modern design collections, archive pieces, and artistic exhibitions since 2025.',
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
    name: 'Brisa asia',
    alternateName: 'BRISA / SANG UN',
    url: 'https://brisa.asia',
    logo: 'https://brisa.asia/logo.png',
    description:
      'Contemporary fashion gallery showcasing modern design collections, archive pieces, and artistic exhibitions since 2025.',
    foundingDate: '2025',
    sameAs: ['https://www.instagram.com/brisa.asia'],
  };

  return (
    <html lang='ko' suppressHydrationWarning>
      <body suppressHydrationWarning data-version={APP_VERSION}>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PageDataProvider>
          <ConditionalHeader />
          <main>{children}</main>
          {/* <Footer /> */}
        </PageDataProvider>
      </body>
    </html>
  );
}
