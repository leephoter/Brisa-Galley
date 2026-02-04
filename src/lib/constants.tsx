import { InstagramLogo } from '@/components/icons';
import { NavigationItem } from '@/types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // TODO: menu depth
  {
    label: 'ARCHIVE',
    // TODO: sangun double depth
    subItems: [
      { label: '2026 SS', href: '/archive/2026-ss' },
      { label: '2026 FW', href: '/archive/2026-fw' },
    ],
  },
  {
    label: 'PLACE',
    href: '/place',
  },
  {
    label: 'NEWS',
    href: '/news',
  },
  {
    label: 'CALL',
    href: '/call',
  },
  {
    label: <InstagramLogo size={20} />,
    href: 'https://instagram.com',
    target: '_blank',
  },
];

export const BREAKPOINTS = {
  mobile: 600,
  tablet: 1024,
  desktop: 1440,
} as const;

export const HEADER_HEIGHT = {
  mobile: 56,
  desktop: 68,
} as const;
