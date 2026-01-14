import { InstagramLogo } from '@/components/icons';
import { NavigationItem } from '@/types';

/**
 * 1. 메인홈에서는 중앙에 메뉴
- Since 2025. SEOUL
2. 각 페이지에서는 헤더에 나열
3. CALL -> email, 안심번호
4. News -> 공지 / 페이지 노출
5. ARCHIVE -> 
- 메뉴바에서 depth 하나 더 추가
- ss | fw -> page 이동
- 적응형으로 2개 상품씩
- 카테고리 (ss | fw) 는 왼쪽사진 좌측 상단
- 
6. PLACE -> 무신사 링크 (maybe)
- 그 전에는 : COMMING SOON…
7. 적응형 -> 로고 오른쪽 햄버거메뉴
8. ARCHIVE 제외 text 좌측정렬
- 레이아웃 중앙정렬


Email, 안심번호, 인스타 계정 링크

 */

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // TODO: menu depth
  {
    label: 'ARCHIVE',
    // TODO: sangun double depth
    subItems: [
      { label: '2025 AW', href: '/collection/2025-aw' },
      { label: 'Archive', href: '/collection/archive' },
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
  desktop: 69,
} as const;
