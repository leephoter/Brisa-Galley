'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import SortableImageGrid from './SortableImageGrid';
import styles from './ArchiveForm.module.css';

interface ArchiveFormProps {
  initialData?: {
    id?: string;
    season: string;
    year: number;
    title: string;
    label?: string;
    description?: string;
    slug: string;
    image_order: string[];
  };
}

export default function ArchiveForm({ initialData }: ArchiveFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    season: initialData?.season || '',
    year: initialData?.year || new Date().getFullYear(),
    title: initialData?.title || '',
    label: initialData?.label || '',
    description: initialData?.description || '',
    slug: initialData?.slug || '',
    image_order: initialData?.image_order || [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData?.id ? `/api/admin/archives/${initialData.id}` : '/api/admin/archives';

      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      router.push('/admin/archives');
      router.refresh();
    } catch (error) {
      console.error('Save error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save archive');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.section}>
        <h2>Basic Information</h2>

        <div className={styles.formGroup}>
          <label>
            Season <span className={'required'}>*</span>
          </label>
          <input
            type='text'
            value={formData.season}
            onChange={(e) => setFormData((prev) => ({ ...prev, season: e.target.value }))}
            placeholder='SPRING / SUMMER'
            required
          />
          <small>2026 SPRING / SUMMER, 2026 FALL / WINTER 등 관리할 archive의 이름</small>
        </div>

        <div className={styles.formGroup}>
          <label>
            Year <span className={'required'}>*</span>
          </label>
          <input
            type='number'
            value={formData.year}
            onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
            min='2000'
            max='2099'
            required
          />
          <small>해당 archive 의 관리 년도</small>
        </div>

        <div className={styles.formGroup}>
          <label>
            Title <span className={'required'}>*</span>
          </label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder='2026 SS'
            required
          />
          <small>해당 페이지에 Title</small>
        </div>

        <div className={styles.formGroup}>
          <label>Label</label>
          <input
            type='text'
            value={formData.label}
            onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
            placeholder={formData.title || '2026 SS'}
          />
          <small>Header 메뉴에 표시될 이름 (비워두면 Title 사용)</small>
        </div>

        <div className={styles.formGroup}>
          <label>
            Slug <span className={'required'}>*</span>
          </label>
          <input
            type='text'
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder='2026-ss'
            pattern='[a-z0-9-]+'
            title='Only lowercase letters, numbers, and hyphens allowed'
            required
          />
          <small>해당 페이지의 url path</small>
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={4}
            placeholder='Optional description'
          />
          <small>해당 페이지의 설명글 (선택)</small>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Images</h2>

        {formData.image_order.length > 0 && (
          <SortableImageGrid
            images={formData.image_order}
            onReorder={(newOrder) => setFormData((prev) => ({ ...prev, image_order: newOrder }))}
            onDelete={(url) => {
              setFormData((prev) => ({
                ...prev,
                image_order: prev.image_order.filter((img) => img !== url),
              }));
            }}
          />
        )}

        <ImageUploader
          folder={formData.slug || 'temp'}
          maxFiles={80}
          onUploadComplete={(urls) => {
            setFormData((prev) => ({
              ...prev,
              image_order: [...prev.image_order, ...urls],
            }));
          }}
        />
      </div>

      <div className={styles.actions}>
        <button
          type='button'
          onClick={() => router.back()}
          disabled={loading}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
        <button type='submit' disabled={loading} className={styles.submitBtn}>
          {loading ? 'Saving...' : initialData?.id ? 'Update Archive' : 'Create Archive'}
        </button>
      </div>
    </form>
  );
}
