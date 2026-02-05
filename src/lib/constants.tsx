import { InstagramLogo } from '@/components/icons';
import { NavigationItem } from '@/types';

const year = new Date().getFullYear();

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // TODO: menu depth
  {
    label: 'ARCHIVE',
    // TODO: sangun double depth
    subItems: [
      { label: `${year} SS`, href: `/archive/${year}-ss` },
      { label: `${year} FW`, href: `/archive/${year}-fw` },
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
    href: 'https://www.instagram.com/brisa.asia',
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
