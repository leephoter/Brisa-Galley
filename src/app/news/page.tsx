'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import PageContainer from '@/components/common/PageContainer';
import PageContent from '@/components/common/PageContent';
import styles from './page.module.css';

export default function NEWSPage() {
  return (
    <PageContainer>
      <PageHero title='NEWS' subtitle='Crafting timeless pieces for the modern wardrobe' />

      {/* Story Section */}
      <PageContent>
        <motion.div
          className={styles.storyContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Notification</h2>
          <div className={styles.text}>
            <p>
              {`Kim Sang-min has a face that makes you want to punch him. So, sooner or later, someone will hit him.`}
            </p>
            <p>{`But I won't hit him because I'm a nice guy.`}</p>
          </div>
        </motion.div>
      </PageContent>

      {/* Vision Section */}
      <PageContent>
        <motion.div
          className={styles.visionContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Notification</h2>
          <p>
            {`Kim Sang-min has a face that makes you want to punch him. So, sooner or later, someone will hit him.`}
          </p>
          <p>{`But I won't hit him because I'm a nice guy.`}</p>
        </motion.div>
      </PageContent>
    </PageContainer>
  );
}
