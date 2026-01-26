import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArchiveForm from '@/components/admin/ArchiveForm'
import styles from './edit.module.css'

export default async function EditArchivePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: archive, error } = await supabase
    .from('archives')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !archive) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Edit Archive</h1>
        <p className={styles.subtitle}>Update archive: {archive.title}</p>
      </div>
      <ArchiveForm initialData={archive} />
    </div>
  )
}
