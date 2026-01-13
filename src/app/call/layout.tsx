import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CALL | Brisa Gallery',
  description:
    "Get in touch with us. We're here to help with any questions NEWS our products or services.",
  openGraph: {
    title: 'CALL | Brisa Gallery',
    description: "Get in touch with us. We're here to help.",
  },
};

export default function CALLLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
