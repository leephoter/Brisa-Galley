'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import InstagramLogo from '@/components/icons/InstagramLogo';
import styles from './Navigation.module.css';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Prevent body scroll when navigation is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleItemClick = (label: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      setExpandedItem(expandedItem === label ? null : label);
    } else {
      onClose();
    }
  };
  // Brisa
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            onClick={onClose}
          />

          {/* Navigation Drawer */}
          <motion.nav
            className={styles.navigation}
            initial={{ x: '-100%' }}
            animate={{
              x: 0,
              transition: { type: 'tween', duration: 0.15 },
            }}
            exit={{
              x: '-100%',
              transition: { type: 'tween', duration: 0 },
            }}
            onClick={onClose}
          >
            <Link
              href={'/'}
              className={styles.logo}
              onClick={() => handleItemClick('BRISA', false)}
            >
              {'BRISA'}
            </Link>
            <ul className={styles.list}>
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href} className={styles.item}>
                  {item.subItems ? (
                    <>
                      <button
                        className={styles.link}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item.href, true);
                        }}
                      >
                        {item.label}
                        {/* <span
                          className={`${styles.arrow} ${
                            expandedItem === item.label ? styles.expanded : ''
                          }`}
                        >
                          ↓
                        </span> */}
                      </button>

                      <AnimatePresence>
                        {expandedItem === item.label && (
                          <motion.ul
                            className={styles.subList}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.subItems.map((subItem) => (
                              <li key={subItem.href} className={styles.subItem}>
                                <Link
                                  href={subItem.href}
                                  className={styles.subLink}
                                  onClick={onClose}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={styles.link}
                      onClick={() => handleItemClick(item.href, false)}
                      target={item.target}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
