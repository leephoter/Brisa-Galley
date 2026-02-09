'use client';

import { motion } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import PageContainer from '@/components/common/PageContainer';
import PageContent from '@/components/common/PageContent';
import { usePageData } from '@/contexts/PageDataContext';
import styles from './page.module.css';
import { CONSTANTS } from '@/lib/data';

export default function CALLPage() {
  const { pageData } = usePageData('call');
  const content = pageData?.content;

  // Theme colors
  const contentTitleColor = pageData?.theme_colors?.contentTitle || '#000000';
  const contentParagraphColor = pageData?.theme_colors?.contentParagraph || '#000000';

  return (
    <PageContainer>
      <PageHero pageKey='call' defaultTitle='CALL' defaultSubtitle="We'd love to hear from you" />

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
                {section.title && <h2 style={{ color: contentTitleColor }}>{section.title}</h2>}
                {section.paragraphs && section.paragraphs.length > 0 && (
                  <div className={styles.text}>
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex} style={{ color: contentParagraphColor }}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.section
              className={styles.infoSection}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className={styles.infoBlock}>
                <h3>Email</h3>
                <a target='_blank' href={`mailto:${CONSTANTS.E_MAIL}`}>
                  {CONSTANTS.E_MAIL}
                </a>
              </div>

              <div className={styles.infoBlock}>
                <h3>Phone</h3>
                <a href={`tel:+82-10-${CONSTANTS.PHONE_NUMBER}`}>
                  +82-10-${CONSTANTS.PHONE_NUMBER}
                </a>
              </div>
            </motion.section>
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
}
