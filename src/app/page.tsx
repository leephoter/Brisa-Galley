import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TABLES, COLUMNS, CONSTANTS } from '@/lib/data';
import styles from './page.module.css';
import PageContainer from '@/components/common/PageContainer';
import HomeClient from '@/app/HomeClient';
import BackgroundImage from './BackgroundImage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Loading fallback for background image
function BackgroundImageFallback() {
  return (
    <div className={styles.fullPageBackground}>
      <div className={styles.heroImage} style={{ backgroundColor: '#f3f4f6' }} />
    </div>
  );
}

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  // Fetch home page settings
  const { data: homePage } = await supabase
    .from(TABLES.PAGES)
    .select('is_published, theme_colors, title, description')
    .eq(COLUMNS.PAGES.PAGE_KEY, 'home')
    .single();

  const textColor = homePage?.theme_colors?.title || '#000000';
  const mainText = homePage?.title || CONSTANTS.BRISA;
  const subText = homePage?.description || CONSTANTS.DESCRIPTION;

  return (
    <>
      <Suspense fallback={<BackgroundImageFallback />}>
        <div className={styles.fullPageBackground}>
          <BackgroundImage />
        </div>
      </Suspense>
      <PageContainer>
        <section className={styles.hero}>
          <HomeClient textColor={textColor} mainText={mainText} subText={subText} />
        </section>
      </PageContainer>
    </>
  );
}
