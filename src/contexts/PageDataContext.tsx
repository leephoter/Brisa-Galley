'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getPages } from '@/lib/api/pages';
import { Page } from '@/types';

interface PageDataContextType {
  pages: Record<string, Page>;
  loading: boolean;
}

const PageDataContext = createContext<PageDataContextType>({
  pages: {},
  loading: true,
});

export function PageDataProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Record<string, Page>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllPages() {
      try {
        const data = await getPages();

        // page_key를 키로 하는 객체로 변환
        const pagesMap = data.reduce((acc, page) => {
          acc[page.page_key] = page;
          return acc;
        }, {} as Record<string, Page>);

        setPages(pagesMap);
      } catch (error) {
        console.error('Failed to fetch pages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllPages();
  }, []);

  return (
    <PageDataContext.Provider value={{ pages, loading }}>
      {children}
    </PageDataContext.Provider>
  );
}

export function usePageData(pageKey: string) {
  const { pages, loading } = useContext(PageDataContext);

  // pageKey가 없으면 null 반환
  if (!pageKey) {
    return {
      pageData: null,
      loading: false,
    };
  }

  return {
    pageData: pages[pageKey] || null,
    loading,
  };
}
