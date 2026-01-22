'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import PageContainer from '@/components/common/PageContainer';
import PageContent from '@/components/common/PageContent';
import styles from './page.module.css';

export default function CALLPage() {
  return (
    <PageContainer>
      <PageHero title='CALL' subtitle="We'd love to hear from you" />

      <PageContent>
        <motion.section
          className={styles.infoSection}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.infoBlock}>
            <h3>Email</h3>
            <a target='_blank' href='mailto:sangun@brisagallery.com'>
              sangun@brisagallery.com
            </a>
          </div>

          <div className={styles.infoBlock}>
            <h3>Phone</h3>
            <a href='tel:+82-10-4972-6335'>+82-10-4972-6335</a>
          </div>
        </motion.section>
      </PageContent>
      <PageContent>
        <motion.div
          className={styles.philosophyContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Email</h3>
              <a target='_blank' href='mailto:sangun@brisagallery.com'>
                sangun@brisagallery.com
              </a>
            </div>
            <div className={styles.card}>
              <h3>Phone</h3>
              <a href='tel:+82-10-4972-6335'>+82-10-4972-6335</a>
            </div>
          </div>
        </motion.div>
      </PageContent>
    </PageContainer>
  );
}
