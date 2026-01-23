'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import styles from './Header.module.css';

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

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
            {NAVIGATION_ITEMS.map((item, index) => (
              <li key={item.href || `nav-item-${index}`} className={styles.navItem}>
                {item.subItems ? (
                  <div
                    className={styles.navItemWithSub}
                    onMouseEnter={() => setOpenDropdown(index)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <span className={styles.navLabel}>{item.label}</span>
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
                  <Link href={item.href as string} className={styles.navLink} target={item.target}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <Link href='/' className={styles.logo}>
          BRISA
        </Link>
      </div>
    </motion.header>
  );
}
