import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Brisa Gallery',
  description:
    "Get in touch with us. We're here to help with any questions about our products or services.",
  openGraph: {
    title: 'Contact | Brisa Gallery',
    description: "Get in touch with us. We're here to help.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
