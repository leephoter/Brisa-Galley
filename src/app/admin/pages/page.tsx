import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import styles from './pages.module.css'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPagesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Pages</h1>
          <p className={styles.subtitle}>Manage navigation pages (Place, News, Call)</p>
        </div>
      </div>

      <div className={styles.list}>
        {pages && pages.length > 0 ? (
          pages.map((page) => (
            <div key={page.id} className={styles.item}>
              <div className={styles.info}>
                <h3>{page.title}</h3>
                <p className={styles.meta}>
                  <span className={styles.pageKey}>{page.page_key.toUpperCase()}</span>
                  <span>/{page.slug}</span>
                  {page.is_published === false && (
                    <span className={styles.unpublished}>Hidden</span>
                  )}
                </p>
                {page.description && (
                  <p className={styles.description}>{page.description}</p>
                )}
              </div>
              <div className={styles.actions}>
                <Link href={`/admin/pages/${page.id}`} className={styles.editBtn}>
                  Edit
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
            <p>No pages found. Run the SQL migration to create default pages.</p>
          </div>
        )}
      </div>
    </div>
  )
}
