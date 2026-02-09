'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import { Archive, Page } from '@/types';
import styles from './Header.module.css';

interface HeaderProps {
  archives?: Archive[];
  pages?: Page[];
  navigationColor?: string;
}

export default function Header({ archives = [], pages = [], navigationColor = '#000000' }: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Archives 및 Pages 데이터로 동적 메뉴 생성
  const navigationItems = useMemo(() => {
    const pagesMap = pages.reduce((acc, page) => {
      acc[page.page_key] = page;
      return acc;
    }, {} as Record<string, Page>);

    return NAVIGATION_ITEMS.flatMap((item) => {
      // ARCHIVE 메뉴는 archives 데이터로 교체
      if (item.label === 'ARCHIVE' && archives.length > 0) {
        return [
          {
            ...item,
            subItems: archives.map((archive) => ({
              label: archive.label || archive.title,
              href: `/archive/${archive.slug}`,
            })),
          },
        ];
      }

      // PLACE, NEWS, CALL 메뉴는 pages 데이터로 교체
      const pageKey = typeof item.label === 'string' ? item.label.toLowerCase() : null;
      if (pageKey && (pageKey === 'place' || pageKey === 'news' || pageKey === 'call')) {
        const page = pagesMap[pageKey];
        if (!page) return []; // is_published = false인 경우 빈 배열 반환 (메뉴에서 제거)

        return [
          {
            ...item,
            label: page.label || page.title,
            href: `/${page.slug}`,
          },
        ];
      }

      return [item];
    });
  }, [archives, pages]);

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.container}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navigationItems.map((item, index) => (
              <li key={item.href || `nav-item-${index}`} className={styles.navItem}>
                {item.subItems ? (
                  <div
                    className={styles.navItemWithSub}
                    onMouseEnter={() => setOpenDropdown(index)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <span className={styles.navLabel} style={{ color: navigationColor }}>{item.label}</span>
                    <ul
                      className={`${styles.subNavList} ${
                        openDropdown === index ? styles.subNavListOpen : ''
                      }`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.subItems.map((subItem) => (
                        <li key={subItem.href} className={styles.subNavItem}>
                          <Link href={subItem.href} className={styles.subNavLink}>
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link href={item.href as string} className={styles.navLink} target={item.target} style={{ color: navigationColor }}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <Link href='/' className={styles.logo} style={{ color: navigationColor }}>
          BRISA
        </Link>
      </div>
    </motion.header>
  );
}
