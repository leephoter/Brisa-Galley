'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import PageContainer from '@/components/common/PageContainer';

export default function Home() {
  return (
    <>
      <div className={styles.fullPageBackground}>
        <Image src='/images/main.png' alt='Background' fill className={styles.heroImage} priority />
      </div>
      <PageContainer>
        <section className={styles.hero}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className={styles.heroTitle}>BRISA</h1>
            <p className={styles.heroSubtitle}>Since 2025. SEOUL</p>
          </motion.div>

          <motion.div
            className={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          ></motion.div>
        </section>
      </PageContainer>
    </>
  );
}
