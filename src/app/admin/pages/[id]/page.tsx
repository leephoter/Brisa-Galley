import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PageForm from '@/components/admin/PageForm';
import { TABLES, COLUMNS } from '@/lib/data';
import styles from './edit.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: page, error } = await supabase
    .from(TABLES.PAGES)
    .select('*')
    .eq(COLUMNS.PAGES.ID, id)
    .single();

  if (error || !page) {
    notFound();
  }

  // Parse JSON content if it exists
  const parsedPage = {
    ...page,
    content:
      typeof page.content === 'string' && page.content ? JSON.parse(page.content) : page.content,
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Edit {page.page_key.toUpperCase()} Page</h1>
        <p className={styles.subtitle}>Update page settings and content</p>
      </div>
      <PageForm page={parsedPage} />
    </div>
  );
}
