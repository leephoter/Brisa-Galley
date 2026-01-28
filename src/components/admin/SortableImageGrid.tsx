'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import styles from './SortableImageGrid.module.css'

interface SortableImageGridProps {
  images: string[]
  onReorder: (newOrder: string[]) => void
  onDelete?: (url: string) => void
}

function SortableImage({ url, onDelete }: { url: string; onDelete?: (url: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: url })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.imageItem}
      {...attributes}
      {...listeners}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={url}
          alt=""
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, 200px"
        />
      </div>
      {onDelete && (
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation()
            if (confirm('Delete this image?')) {
              onDelete(url)
            }
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default function SortableImageGrid({
  images,
  onReorder,
  onDelete
}: SortableImageGridProps) {
  const [items, setItems] = useState(images)

  useEffect(() => {
    setItems(images)
  }, [images])

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        const newOrder = arrayMove(items, oldIndex, newIndex)
        onReorder(newOrder)
        return newOrder
      })
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <p className={styles.hint}>Drag to reorder images</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className={styles.grid}>
            {items.map((url) => (
              <SortableImage key={url} url={url} onDelete={onDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
