import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TABLES, COLUMNS } from '@/lib/data';
import styles from './page.module.css';
import PageContainer from '@/components/common/PageContainer';
import HomeClient from '@/app/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  // Fetch home page settings
  const { data: homePage } = await supabase
    .from(TABLES.PAGES)
    .select('image_url, is_published, theme_colors, title, description')
    .eq(COLUMNS.PAGES.PAGE_KEY, 'home')
    .single();

  // Use custom image if available and published, otherwise use default
  const backgroundImage = homePage?.image_url ?? null;
  const textColor = homePage?.theme_colors?.title || '#000000';
  const mainText = homePage?.title || 'BRISA';
  const subText = homePage?.description || 'Since 2025. SEOUL';

  return (
    <>
      <div className={styles.fullPageBackground}>
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt='Background'
            fill
            className={styles.heroImage}
            priority
          />
        )}
      </div>
      <PageContainer>
        <section className={styles.hero}>
          <HomeClient textColor={textColor} mainText={mainText} subText={subText} />
        </section>
      </PageContainer>
    </>
  );
}
