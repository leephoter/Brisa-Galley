import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TABLES, COLUMNS } from '@/lib/data';
import styles from './page.module.css';

export default async function BackgroundImage() {
  const supabase = await createServerSupabaseClient();

  const { data: homePage } = await supabase
    .from(TABLES.PAGES)
    .select('image_url')
    .eq(COLUMNS.PAGES.PAGE_KEY, 'home')
    .single();

  const backgroundImage = homePage?.image_url;

  if (!backgroundImage) {
    return null;
  }

  return (
    <Image
      src={backgroundImage}
      alt='Background'
      fill
      className={styles.heroImage}
      priority
    />
  );
}
