'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './ArchiveList.module.css'

interface Archive {
  id: string
  title: string
  season: string
  year: number
  slug: string
  image_order: string[]
  is_published?: boolean
  display_order?: number
}

function SortableArchiveItem({
  archive,
  onDelete,
  deleting,
}: {
  archive: Archive
  onDelete: (id: string, title: string) => void
  deleting: string | null
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: archive.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.item}>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="7" cy="5" r="1.5" />
          <circle cx="13" cy="5" r="1.5" />
          <circle cx="7" cy="10" r="1.5" />
          <circle cx="13" cy="10" r="1.5" />
          <circle cx="7" cy="15" r="1.5" />
          <circle cx="13" cy="15" r="1.5" />
        </svg>
      </div>
      <div className={styles.info}>
        <h3>{archive.title}</h3>
        <p className={styles.season}>
          {archive.season} {archive.year}
        </p>
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
          onClick={() => onDelete(archive.id, archive.title)}
          disabled={deleting === archive.id}
          className={styles.deleteBtn}
        >
          {deleting === archive.id ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

export default function ArchiveList({ archives: initialArchives }: { archives: Archive[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deletingAll, setDeletingAll] = useState(false)
  const [archives, setArchives] = useState(initialArchives)
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Sync with server data when it changes
  useEffect(() => {
    setArchives(initialArchives)
  }, [initialArchives])

  // Only enable drag and drop after client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = archives.findIndex((item) => item.id === active.id)
      const newIndex = archives.findIndex((item) => item.id === over.id)
      const newOrderedArchives = arrayMove(archives, oldIndex, newIndex)

      // Optimistically update UI
      setArchives(newOrderedArchives)

      // Save new order to server
      setSaving(true)
      try {
        const reorderedIds = newOrderedArchives.map((archive) => archive.id)

        const response = await fetch('/api/admin/archives/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: reorderedIds }),
        })

        const data = await response.json()

        if (!response.ok) {
          console.error('Reorder failed:', data)
          throw new Error(data.error || 'Failed to save order')
        }

        router.refresh()
      } catch (error: unknown) {
        console.error('Reorder error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to save order'
        alert(`Failed to save order: ${errorMessage}\n\nPlease check if the display_order column exists in the archives table.`)
        // Revert to original order on error
        setArchives(archives)
      } finally {
        setSaving(false)
      }
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return

    setDeleting(id)

    try {
      const response = await fetch(`/api/admin/archives/${id}`, {
        method: 'DELETE',
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

  async function handleDeleteAll() {
    if (!confirm(`Delete ALL ${archives.length} archives? This action cannot be undone!`)) return
    if (!confirm('Are you absolutely sure? This will delete ALL archives and their images permanently!')) return

    setDeletingAll(true)

    try {
      // Delete all archives one by one
      const deletePromises = archives.map((archive) =>
        fetch(`/api/admin/archives/${archive.id}`, {
          method: 'DELETE',
        })
      )

      const results = await Promise.all(deletePromises)

      const failedDeletes = results.filter((res) => !res.ok)
      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} archives`)
      }

      router.refresh()
    } catch (error) {
      console.error('Delete all error:', error)
      alert('Failed to delete all archives. Some may have been deleted.')
      router.refresh()
    } finally {
      setDeletingAll(false)
    }
  }

  if (archives.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No archives yet. Create your first archive to get started.</p>
      </div>
    )
  }

  // Show simple list during SSR, enable drag and drop after mount
  if (!mounted) {
    return (
      <div className={styles.list}>
        {archives.map((archive) => (
          <div key={archive.id} className={styles.item}>
            <div className={styles.info}>
              <h3>{archive.title}</h3>
              <p className={styles.season}>
                {archive.season} {archive.year}
              </p>
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

  return (
    <>
      <div className={styles.listHeader}>
        <p className={styles.listCount}>{archives.length} archive(s)</p>
        <button
          onClick={handleDeleteAll}
          disabled={deletingAll || deleting !== null}
          className={styles.deleteAllBtn}
        >
          {deletingAll ? 'Deleting All...' : 'Delete All'}
        </button>
      </div>

      {saving && (
        <div className={styles.savingIndicator}>
          Saving order...
        </div>
      )}
      <p className={styles.hint}>Drag to reorder archives (affects header menu order)</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={archives.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.list}>
            {archives.map((archive) => (
              <SortableArchiveItem
                key={archive.id}
                archive={archive}
                onDelete={handleDelete}
                deleting={deleting}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  )
}
