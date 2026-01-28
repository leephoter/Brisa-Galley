'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './PageForm.module.css'

interface PageFormProps {
  page: {
    id: string
    page_key: string
    title: string
    label?: string
    description?: string
    slug: string
    content?: string
    is_published?: boolean
  }
}

export default function PageForm({ page }: PageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: page.title || '',
    label: page.label || '',
    description: page.description || '',
    slug: page.slug || '',
    content: page.content || '',
    is_published: page.is_published !== undefined ? page.is_published : true
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }

      router.push('/admin/pages')
      router.refresh()
    } catch (error) {
      console.error('Save error:', error)
      setError(error instanceof Error ? error.message : 'Failed to save page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.section}>
        <h2>페이지 정보</h2>

        <div className={styles.formGroup}>
          <label>
            페이지 타입 <span className="required">*</span>
          </label>
          <input
            type="text"
            value={page.page_key.toUpperCase()}
            disabled
            className={styles.disabled}
          />
          <small>페이지 타입은 변경할 수 없습니다</small>
        </div>

        <div className={styles.formGroup}>
          <label>
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="PLACE"
            required
          />
          <small>페이지 제목</small>
        </div>

        <div className={styles.formGroup}>
          <label>Label</label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
            placeholder={formData.title || 'PLACE'}
          />
          <small>Header 메뉴에 표시될 문구 (비워두면 Title 사용)</small>
        </div>

        <div className={styles.formGroup}>
          <label>
            Slug <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.slug}
            disabled
            className={styles.disabled}
          />
          <small>URL 경로는 변경할 수 없습니다 (/{formData.slug})</small>
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="페이지 설명"
          />
          <small>페이지 설명 (선택사항)</small>
        </div>

        <div className={styles.formGroup}>
          <label>Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
            placeholder="페이지 내용"
          />
          <small>페이지 내용 (선택사항, 향후 사용)</small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
            />
            <span>공개</span>
          </label>
          <small>체크 해제 시 Header 메뉴에서 숨김</small>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Saving...' : 'Update Page'}
        </button>
      </div>
    </form>
  )
}
