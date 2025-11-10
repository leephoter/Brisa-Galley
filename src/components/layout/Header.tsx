'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import styles from './Header.module.css';

export default function Header() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const toggleNavigation = () => {
    setIsNavigationOpen((prev) => !prev);
  };

  const closeNavigation = () => {
    setIsNavigationOpen(false);
  };

  return (
    <>
      <motion.header
        className={styles.header}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.container}>
          <button
            className={styles.hamburger}
            onClick={toggleNavigation}
            aria-label='Toggle navigation'
            aria-expanded={isNavigationOpen}
          >
            <span className={`${styles.line} ${isNavigationOpen ? styles.open : ''}`} />
            <span className={`${styles.line} ${isNavigationOpen ? styles.open : ''}`} />
            <span className={`${styles.line} ${isNavigationOpen ? styles.open : ''}`} />
          </button>
          <Link href='/' className={styles.logo}>
            BRISA
          </Link>
        </div>
      </motion.header>

      <Navigation isOpen={isNavigationOpen} onClose={closeNavigation} />
    </>
  );
}
