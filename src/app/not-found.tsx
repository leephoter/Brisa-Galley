'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>PAGE NOT FOUND</p>
        <p className={styles.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className={styles.homeLink}>
          RETURN HOME
        </Link>
      </motion.div>
    </div>
  );
}
