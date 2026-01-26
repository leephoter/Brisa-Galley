'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './ArchiveList.module.css'

interface Archive {
  id: string
  title: string
  season: string
  year: number
  slug: string
  image_order: string[]
  is_published?: boolean
}

export default function ArchiveList({ archives }: { archives: Archive[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return

    setDeleting(id)

    try {
      const response = await fetch(`/api/admin/archives/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete archive')
    } finally {
      setDeleting(null)
    }
  }

  if (archives.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No archives yet. Create your first archive to get started.</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {archives.map((archive) => (
        <div key={archive.id} className={styles.item}>
          <div className={styles.info}>
            <h3>{archive.title}</h3>
            <p className={styles.season}>{archive.season} {archive.year}</p>
            <p className={styles.meta}>
              <span>{archive.image_order?.length || 0} images</span>
              {archive.is_published === false && (
                <span className={styles.unpublished}>Unpublished</span>
              )}
            </p>
            <p className={styles.slug}>/{archive.slug}</p>
          </div>
          <div className={styles.actions}>
            <Link href={`/admin/archives/${archive.id}`} className={styles.editBtn}>
              Edit
            </Link>
            <button
              onClick={() => handleDelete(archive.id, archive.title)}
              disabled={deleting === archive.id}
              className={styles.deleteBtn}
            >
              {deleting === archive.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
