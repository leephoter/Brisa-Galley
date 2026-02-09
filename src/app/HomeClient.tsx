'use client';

import { motion } from 'framer-motion';
import styles from './page.module.css';

interface HomeClientProps {
  textColor?: string;
  mainText?: string;
  subText?: string;
}

export default function HomeClient({ textColor = '#000000', mainText = 'BRISA', subText = 'Since 2025. SEOUL' }: HomeClientProps) {
  return (
    <>
      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ color: textColor }}
      >
        <h1 className={styles.heroTitle} style={{ color: textColor }}>{mainText}</h1>
        <p className={styles.heroSubtitle} style={{ color: textColor }}>{subText}</p>
      </motion.div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      ></motion.div>
    </>
  );
}
