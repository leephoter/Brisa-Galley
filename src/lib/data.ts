import { Archive } from '@/types';

// Archives (시즌별 이미지 갤러리)
export const archives: Archive[] = [
  {
    id: '1',
    season: 'Wait for it...',
    year: 2026,
    title: 'Coming soon',
    description: 'Wait for it...',
    slug: '2026-ss',
    images: [],
  },
  {
    id: '2',
    season: 'Wait for it...',
    year: 2026,
    title: 'Coming soon',
    description: 'Wait for it...',
    slug: '2026-fw',
    images: [],
  },
];

// ==================== Supabase Constants ====================

// Storage
export const STORAGE = {
  BUCKET_NAME: 'brisa-images',
  PUBLIC_PATH: '/storage/v1/object/public',
} as const;

// Database Tables
export const TABLES = {
  ARCHIVES: 'archives',
  ADMIN_USERS: 'admin_users',
  PAGES: 'pages',
} as const;

// Table Columns
export const COLUMNS = {
  ARCHIVES: {
    ID: 'id',
    SEASON: 'season',
    YEAR: 'year',
    TITLE: 'title',
    LABEL: 'label',
    DESCRIPTION: 'description',
    SLUG: 'slug',
    IMAGE_ORDER: 'image_order',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
    CREATED_BY: 'created_by',
    IS_PUBLISHED: 'is_published',
    DISPLAY_ORDER: 'display_order',
  },
  ADMIN_USERS: {
    ID: 'id',
    EMAIL: 'email',
    ROLE: 'role',
    CREATED_AT: 'created_at',
    CONFIRMED_AT: 'confirmed_at',
  },
  PAGES: {
    ID: 'id',
    PAGE_KEY: 'page_key',
    TITLE: 'title',
    LABEL: 'label',
    DESCRIPTION: 'description',
    SLUG: 'slug',
    CONTENT: 'content',
    IMAGE_URL: 'image_url',
    THEME_COLORS: 'theme_colors',
    IS_PUBLISHED: 'is_published',
    DISPLAY_ORDER: 'display_order',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },
} as const;

// 상수값
export const BRISA = {
  EN: {
    UPPER: 'BRISA',
    LOWER: 'Brisa',
  },
  KO: '브리사',
  DOMAIN: 'brisa.asia',
};
export const CONSTANTS = {
  BRISA: `${BRISA.EN.UPPER} (${BRISA.KO})`,
  BRISA_ASIA: `${BRISA.EN.LOWER} asia`,
  E_MAIL: 'brisa562@naver.com',
  PHONE_NUMBER: '4972-6335',
  PLEASE_WAIT_MESSAGE: 'Coming Soon...',
  BASE_MOTION: {
    INITIAL: { opacity: 0, y: 10 },
    WHILE_IN_VIEW: { opacity: 1, y: 0 },
    VIEWPORT: { once: true },
    TRANSITION: (delay: number = 0) => ({ duration: 0.4, delay }),
  },
  DESCRIPTION: `Men's Tops, Bottoms and Outerwear`,
  DOMAIN: 'brisa.asia',
  URL: `https://${BRISA.DOMAIN}`,
  INSTAGRAM: 'https://www.instagram.com/brisa.asia',
};
