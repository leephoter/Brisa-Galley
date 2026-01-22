'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import PageContainer from '@/components/common/PageContainer';
import PageContent from '@/components/common/PageContent';
import styles from './page.module.css';

export default function PLACEPage() {
  return (
    <PageContainer>
      <PageHero title='PLACE' subtitle='Find our collections at these select locations worldwide' />

      <PageContent>
        <motion.div
          className={styles.infoContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>COMMING SOON...</h2>
        </motion.div>
      </PageContent>
    </PageContainer>
  );
}
