import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PageForm from '@/components/admin/PageForm'
import styles from './edit.module.css'

export default async function EditPagePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !page) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Edit {page.page_key.toUpperCase()} Page</h1>
        <p className={styles.subtitle}>Update page settings and content</p>
      </div>
      <PageForm page={page} />
    </div>
  )
}
