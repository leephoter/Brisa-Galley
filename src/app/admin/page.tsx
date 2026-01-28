import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from './dashboard.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  const { count: archiveCount } = await supabase
    .from('archives')
    .select('*', { count: 'exact', head: true });

  const { data: recentArchives } = await supabase
    .from('archives')
    .select('id, title, season, year, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <p className={styles.subtitle}>Welcome to the Fashion Gallery Admin Panel</p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h2>Archives</h2>
          <p className={styles.count}>{archiveCount || 0}</p>
          <Link href='/admin/archives' className={styles.cardLink}>
            Manage Archives
          </Link>
        </div>
        <div className={styles.card}>
          <h2>Pages</h2>
          <p className={styles.count}>{archiveCount || 0}</p>
          <Link href='/admin/pages' className={styles.cardLink}>
            Manage Pages
          </Link>
        </div>
      </div>

      {recentArchives && recentArchives.length > 0 && (
        <div className={styles.recent}>
          <h2>Recent Archives</h2>
          <div className={styles.recentList}>
            {recentArchives.map((archive) => (
              <Link
                key={archive.id}
                href={`/admin/archives/${archive.id}`}
                className={styles.recentItem}
              >
                <div>
                  <h3>{archive.title}</h3>
                  <p>
                    {archive.season} {archive.year}
                  </p>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
