import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import ArchiveList from '@/components/admin/ArchiveList';
import styles from './archives.module.css';

export default async function AdminArchivesPage() {
  const supabase = await createServerSupabaseClient();

  // Try to fetch with display_order, fallback to year if column doesn't exist
  const { data: archivesData, error: initialError } = await supabase
    .from('archives')
    .select('*')
    .order('display_order', { ascending: true })
    .order('year', { ascending: false });

  let archives = archivesData;
  let error = initialError;

  // If display_order column doesn't exist yet, fallback to year only
  if (error && error.message.includes('display_order')) {
    console.log('display_order column not found, using fallback sorting');
    const fallback = await supabase
      .from('archives')
      .select('*')
      .order('year', { ascending: false })
      .order('created_at', { ascending: false });

    archives = fallback.data;
    error = fallback.error;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Archives</h1>
          <p className={styles.subtitle}>Manage your archive collections</p>
        </div>
        <Link href='/admin/archives/new' className={styles.createBtn}>
          + Create New Archive
        </Link>
      </div>

      {error && !archives && (
        <div style={{ padding: '2rem', color: 'red' }}>Error loading archives: {error.message}</div>
      )}

      <ArchiveList archives={archives || []} />
    </div>
  );
}
