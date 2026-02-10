import type { Metadata } from 'next';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import { PageDataProvider } from '@/contexts/PageDataContext';
import './globals.css';
import packageJson from '../../package.json';
import { BRISA, CONSTANTS } from '@/lib/data';

const APP_VERSION = packageJson.version;

export const metadata: Metadata = {
  metadataBase: new URL(`${CONSTANTS.URL}`),
  title: {
    default: `${CONSTANTS.BRISA} - ${CONSTANTS.DESCRIPTION}`,
    template: `%s | ${BRISA.EN.LOWER}`,
  },
  description: `${CONSTANTS.BRISA} - ${CONSTANTS.DESCRIPTION} in Seoul. Modern design collections, archive pieces, and artistic exhibitions. SANG UN fashion brand.`,
  keywords: [
    BRISA.EN.LOWER,
    BRISA.KO,
    BRISA.EN.UPPER,
    'SANG UN',
    'manswear',
    '남성패션',
    'modern design',
    'Seoul fashion',
    '서울 패션',
  ],
  authors: [{ name: CONSTANTS.BRISA, url: CONSTANTS.URL }],
  creator: CONSTANTS.BRISA,
  publisher: CONSTANTS.BRISA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: `${CONSTANTS.URL}`,
    siteName: CONSTANTS.BRISA,
    title: `${CONSTANTS.BRISA} - ${CONSTANTS.DESCRIPTION}`,
    description: `${CONSTANTS.BRISA} - ${CONSTANTS.DESCRIPTION} in Seoul. Modern design collections, archive pieces, and artistic exhibitions. SANG UN fashion brand.`,
    images: [
      {
        url: '/images/ogImage.png',
        width: 1200,
        height: 630,
        alt: `${CONSTANTS.BRISA} Fashion Gallery`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CONSTANTS.BRISA} - ${CONSTANTS.DESCRIPTION}`,
    description: `${CONSTANTS.BRISA} - ${CONSTANTS.DESCRIPTION} in Seoul. Modern design collections, archive pieces, and artistic exhibitions. SANG UN fashion brand.`,
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
    // 네이버 웹마스터 도구 verification code
    // naver: 'your-naver-verification-code',
  },
  other: {
    // 추가 메타 태그 (네이버 검색 최적화)
    'naver-site-verification': '',
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
    name: BRISA.EN.LOWER,
    alternateName: [BRISA.KO, BRISA.EN.UPPER, 'SANG UN', CONSTANTS.BRISA_ASIA],
    url: CONSTANTS.URL,
    logo: `${CONSTANTS.URL}/logo.png`,
    description: `${CONSTANTS.BRISA} - ${CONSTANTS.DESCRIPTION} in Seoul showcasing modern design collections, archive pieces, and artistic exhibitions.`,
    foundingDate: '2025',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      addressLocality: 'Seoul',
    },
    sameAs: [CONSTANTS.INSTAGRAM],
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
