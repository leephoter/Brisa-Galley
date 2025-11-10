'use client';

import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          {/* Placeholder for hero image - users can replace with actual image */}
          <div className={styles.heroImagePlaceholder} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className={styles.heroTitle}>Brisa Gallery</h1>
          <p className={styles.heroSubtitle}>Since 2025. BRISA / SANG UN</p>
        </motion.div>

        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          {/* <span>SCROLL</span>
          <div className={styles.scrollLine} /> */}
        </motion.div>
      </section>
      {/* 
      <section className={styles.intro}>
        <motion.div
          className={styles.introContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2>Contemporary Brisa</h2>
          <p>
            Experience the intersection of timeless design and modern aesthetics. Our curated
            collections represent the finest in contemporary Brisa, where every piece tells a
            story of craftsmanship and innovation.
          </p>
          <Link href='/collection' className={styles.ctaButton}>
            VIEW COLLECTION
          </Link>
        </motion.div>
      </section> */}
    </div>
  );
}
