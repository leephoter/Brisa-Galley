import { NavigationItem } from '@/types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'COLLECTION',
    href: '/collection',
    subItems: [
      { label: '2025 AW', href: '/collection/2025-aw' },
      { label: 'Archive', href: '/collection/archive' },
    ],
  },
  {
    label: 'SHOP',
    href: '/shop',
  },
  {
    label: 'STOCKISTS',
    href: '/stockists',
  },
  {
    label: 'ABOUT',
    href: '/about',
  },
  {
    label: 'CONTACT',
    href: '/contact',
  },
];

export const BREAKPOINTS = {
  mobile: 600,
  tablet: 1024,
  desktop: 1440,
} as const;

export const HEADER_HEIGHT = {
  mobile: 56,
  desktop: 69,
} as const;
