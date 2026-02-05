import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Get in touch with us. We're here to help with any questions about our products or services. Contact Brisa asia for inquiries and support.",
  keywords: ['contact Brisa', 'customer service', 'inquiries', 'support', 'get in touch'],
  openGraph: {
    title: 'Contact | Brisa asia',
    description: "Get in touch with us. We're here to help.",
    url: 'https://brisa.asia/call',
    type: 'website',
    images: ['/images/ogImage.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Brisa asia',
    description: "Get in touch with us. We're here to help.",
    images: ['/images/ogImage.png'],
  },
};

export default function CALLLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
