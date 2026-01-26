import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ArchiveList from '@/components/admin/ArchiveList'
import styles from './archives.module.css'

export default async function AdminArchivesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: archives } = await supabase
    .from('archives')
    .select('*')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Archives</h1>
          <p className={styles.subtitle}>Manage your archive collections</p>
        </div>
        <Link href="/admin/archives/new" className={styles.createBtn}>
          + Create New Archive
        </Link>
      </div>

      <ArchiveList archives={archives || []} />
    </div>
  )
}
