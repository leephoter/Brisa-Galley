import ArchiveForm from '@/components/admin/ArchiveForm'
import styles from './new.module.css'

export default function NewArchivePage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Create New Archive</h1>
        <p className={styles.subtitle}>Add a new archive collection to your gallery</p>
      </div>
      <ArchiveForm />
    </div>
  )
}
