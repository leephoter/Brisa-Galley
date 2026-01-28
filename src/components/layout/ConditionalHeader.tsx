'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './Header';
import { getArchives } from '@/lib/api/archives';
import { getPages } from '@/lib/api/pages';
import { Archive, Page } from '@/types';
import styles from './ConditionalHeader.module.css';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const [archives, setArchives] = useState<Archive[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  // admin 및 login 페이지에서는 Header 숨기기
  const hideHeader = pathname.startsWith('/admin') || pathname === '/login';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [archivesData, pagesData] = await Promise.all([
          getArchives(),
          getPages()
        ]);
        setArchives(archivesData);
        setPages(pagesData);
      } catch (error) {
        console.error('Failed to fetch header data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!hideHeader) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [hideHeader]);

  if (hideHeader) {
    return null;
  }

  // 데이터 로딩 중에는 Header 높이만큼 공간 확보
  if (loading) {
    return <div className={styles.headerSkeleton} aria-label="Loading header" />;
  }

  return <Header archives={archives} pages={pages} />;
}
