'use client';

import { motion } from 'framer-motion';
import { usePageData } from '@/contexts/PageDataContext';
import styles from './PageHero.module.css';

interface PageHeroProps {
  // 직접 전달 모드 (archive 등에서 사용)
  title?: string;
  subtitle?: string;
  // 또는 동적 fetch 모드 (place, news, call에서 사용)
  pageKey?: 'place' | 'news' | 'call';
  defaultTitle?: string;
  defaultSubtitle?: string;
}

export default function PageHero({
  title: directTitle,
  subtitle: directSubtitle,
  pageKey,
  defaultTitle,
  defaultSubtitle,
}: PageHeroProps) {
  // Context에서 데이터 가져오기
  const { pageData, loading } = usePageData(pageKey || '');

  // 직접 전달된 값이 있으면 사용, 없으면 Context 데이터 사용
  const isLoading = !directTitle && pageKey && loading;
  const title = directTitle || pageData?.title || pageData?.label || defaultTitle || '';
  const subtitle = directSubtitle || pageData?.description || defaultSubtitle;

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {isLoading ? (
          <>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonSubtitle} />
          </>
        ) : (
          <>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </>
        )}
      </motion.div>
    </section>
  );
}
