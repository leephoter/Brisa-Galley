'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { STORAGE } from '@/lib/data';
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
  const [deletingAllImages, setDeletingAllImages] = useState(false);
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

  async function handleDeleteAllImages() {
    if (formData.image_order.length === 0) return;

    if (
      !confirm(
        `${formData.image_order.length} 개의 이미지를 삭제합니다. \n 이 작업은 되돌릴 수 없습니다.`,
      )
    )
      return;

    setDeletingAllImages(true);
    setError(null);

    try {
      const supabase = createClient();

      // Delete all images from storage
      const deletePromises = formData.image_order.map((imageUrl) => {
        // Extract path from URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        const path = pathParts.slice(-2).join('/'); // folder/filename

        return supabase.storage.from(STORAGE.BUCKET_NAME).remove([path]);
      });

      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter((result) => result.error);

      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} images from storage`);
      }

      // Clear image_order in form
      setFormData((prev) => ({
        ...prev,
        image_order: [],
      }));

      alert('모든 이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('Delete all images error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete all images');
    } finally {
      setDeletingAllImages(false);
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
        <div className={styles.sectionHeader}>
          <h2>Images</h2>
          {formData.image_order.length > 0 && (
            <button
              type='button'
              onClick={handleDeleteAllImages}
              disabled={deletingAllImages || loading}
              className={styles.deleteAllImagesBtn}
            >
              {deletingAllImages
                ? 'Deleting All...'
                : `Delete All (${formData.image_order.length})`}
            </button>
          )}
        </div>

        {formData.image_order.length > 0 && (
          <SortableImageGrid
            images={formData.image_order}
            onReorder={(newOrder) => setFormData((prev) => ({ ...prev, image_order: newOrder }))}
            onDelete={async (url) => {
              try {
                const supabase = createClient();

                // Extract path from URL
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/');
                const path = pathParts.slice(-2).join('/'); // folder/filename

                // Delete from storage
                const { error } = await supabase.storage.from(STORAGE.BUCKET_NAME).remove([path]);

                if (error) {
                  throw error;
                }

                // Remove from form state
                setFormData((prev) => ({
                  ...prev,
                  image_order: prev.image_order.filter((img) => img !== url),
                }));
              } catch (error) {
                console.error('Delete image error:', error);
                setError(error instanceof Error ? error.message : 'Failed to delete image');
              }
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
