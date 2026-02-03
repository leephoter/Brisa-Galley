'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import PageContainer from '@/components/common/PageContainer';
import PageContent from '@/components/common/PageContent';
import { usePageData } from '@/contexts/PageDataContext';
import styles from './page.module.css';
import { CONSTANTS } from '@/lib/data';

export default function PLACEPage() {
  const { pageData } = usePageData('place');
  const content = pageData?.content;

  return (
    <PageContainer>
      <PageHero
        pageKey='place'
        defaultTitle='PLACE'
        defaultSubtitle='Find our collections at these select locations worldwide'
      />
      <PageContent>
        <div className={styles.newsContainer}>
          {content && content.sections && content.sections.length > 0 ? (
            content.sections.map((section, index) => (
              <motion.div
                key={section.id}
                className={styles.storyContent}
                initial={CONSTANTS.BASE_MOTION.INITIAL}
                whileInView={CONSTANTS.BASE_MOTION.WHILE_IN_VIEW}
                viewport={CONSTANTS.BASE_MOTION.VIEWPORT}
                transition={CONSTANTS.BASE_MOTION.TRANSITION(index)}
              >
                {section.title && <h2>{section.title}</h2>}
                {section.paragraphs && section.paragraphs.length > 0 && (
                  <div className={styles.text}>
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              className={styles.storyContent}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h1>{CONSTANTS.PLEASE_WAIT_MESSAGE}</h1>
            </motion.div>
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
}
