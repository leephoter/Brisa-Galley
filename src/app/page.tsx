'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroImagePlaceholder} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className={styles.heroTitleRow}>
            <h1 className={styles.heroTitle}>BRISA</h1>
            <nav className={styles.heroNav}>
              <ul className={styles.navList}>
                {NAVIGATION_ITEMS.map((item, index) => (
                  <li key={item.href || `nav-item-${index}`} className={styles.navItem}>
                    {item.subItems && !item.href ? (
                      <div className={styles.navItemWithSub}>
                        <span className={styles.navLabel}>{item.label}</span>
                        <ul className={styles.subNavList}>
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
                      <Link
                        href={item.href as string}
                        className={styles.navLink}
                        target={item.target}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className={styles.heroSubtitle}>Since 2025. BRISA / SANG UN</p>
        </motion.div>

        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        ></motion.div>
      </section>
    </div>
  );
}
