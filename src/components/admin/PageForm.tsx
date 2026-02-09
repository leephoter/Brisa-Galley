'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContent } from '@/types';
import PageContentEditor from './PageContentEditor';
import ImageUploader from './ImageUploader';
import styles from './PageForm.module.css';

interface ThemeColors {
  navigation: string;
  title: string;
  description: string;
  contentTitle: string;
  contentParagraph: string;
}

interface PageFormProps {
  page: {
    id: string;
    page_key: string;
    title: string;
    label?: string;
    description?: string;
    slug: string;
    content?: PageContent | null;
    is_published?: boolean;
    image_url?: string | null;
    theme_colors?: ThemeColors | null;
  };
}

const defaultThemeColors: ThemeColors = {
  navigation: '#000000',
  title: '#000000',
  description: '#000000',
  contentTitle: '#000000',
  contentParagraph: '#000000',
};

export default function PageForm({ page }: PageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: page.title || '',
    label: page.label || '',
    description: page.description || '',
    slug: page.slug || '',
    content: page.content || null,
    is_published: page.is_published !== undefined ? page.is_published : true,
    image_url: page.image_url || null,
    theme_colors: page.theme_colors || defaultThemeColors,
  });

  const isHomePage = page.page_key === 'home';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      router.push('/admin/pages');
      router.refresh();
    } catch (error) {
      console.error('Save error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save page');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.section}>
        {isHomePage ? (
          <>
            <h2>메인 페이지 설정</h2>

            <div className={styles.formGroup}>
              <label>
                메인 텍스트 (큰 글씨) <span className='required'>*</span>
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder='BRISA'
                required
              />
              <small>메인 페이지 중앙의 큰 텍스트 (예: BRISA)</small>
            </div>

            <div className={styles.formGroup}>
              <label>서브 텍스트 (작은 글씨)</label>
              <input
                type='text'
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder='Since 2025. SEOUL'
              />
              <small>메인 텍스트 아래 작은 글씨 (예: Since 2025. SEOUL)</small>
            </div>

            <div className={styles.formGroup}>
              <label>배경 이미지</label>
              {formData.image_url && (
                <div className={styles.currentImage}>
                  <img
                    src={formData.image_url}
                    alt='Current background'
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      marginBottom: '1rem',
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => setFormData((prev) => ({ ...prev, image_url: null }))}
                    className={styles.removeImageBtn}
                  >
                    Remove Image
                  </button>
                </div>
              )}
              <ImageUploader
                folder='home'
                maxFiles={1}
                onUploadComplete={(urls) => {
                  if (urls.length > 0) {
                    setFormData((prev) => ({ ...prev, image_url: urls[0] }));
                  }
                }}
              />
              <small>메인 페이지의 배경 이미지 (권장: 1920x1080 이상, 최대 100MB)</small>
            </div>

            <div className={styles.formGroup}>
              <h3>색상 설정</h3>
              <div className={styles.colorGrid}>
                <div className={styles.colorInput}>
                  <label>메뉴(Navigation) 색상</label>
                  <input
                    type='color'
                    value={formData.theme_colors.navigation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, navigation: e.target.value },
                      }))
                    }
                  />
                  <input
                    type='text'
                    value={formData.theme_colors.navigation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, navigation: e.target.value },
                      }))
                    }
                    placeholder='#000000'
                    className={styles.colorText}
                  />
                </div>
                <div className={styles.colorInput}>
                  <label>메인 텍스트 색상 (BRISA, Since 2025)</label>
                  <input
                    type='color'
                    value={formData.theme_colors.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, title: e.target.value },
                      }))
                    }
                  />
                  <input
                    type='text'
                    value={formData.theme_colors.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, title: e.target.value },
                      }))
                    }
                    placeholder='#000000'
                    className={styles.colorText}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input
                  type='checkbox'
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_published: e.target.checked }))
                  }
                />
                <span>사용</span>
              </label>
              <small>체크 해제 시 기본 이미지(/images/main.png) 사용</small>
            </div>
          </>
        ) : (
          <>
            <h2>페이지 정보</h2>

            <div className={styles.formGroup}>
              <label>
                페이지 타입 <span className='required'>*</span>
              </label>
              <input
                type='text'
                value={page.page_key.toUpperCase()}
                disabled
                className={styles.disabled}
              />
              <small>페이지 타입은 변경할 수 없습니다</small>
            </div>

            <div className={styles.formGroup}>
              <label>
                Title <span className='required'>*</span>
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder='PLACE'
                required
              />
              <small>페이지 제목</small>
            </div>

            <div className={styles.formGroup}>
              <label>Label</label>
              <input
                type='text'
                value={formData.label}
                onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                placeholder={formData.title || 'PLACE'}
              />
              <small>Header 메뉴에 표시될 문구 (비워두면 Title 사용)</small>
            </div>

            <div className={styles.formGroup}>
              <label>
                Slug <span className='required'>*</span>
              </label>
              <input type='text' value={formData.slug} disabled className={styles.disabled} />
              <small>URL 경로는 변경할 수 없습니다 (/{formData.slug})</small>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder='페이지 설명'
              />
              <small>페이지 설명 (선택사항)</small>
            </div>

            <div className={styles.formGroup}>
              <label>Content</label>
              <PageContentEditor
                content={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              />
              <small>페이지 내용 섹션 (제목과 단락을 추가/수정할 수 있습니다)</small>
            </div>

            <div className={styles.formGroup}>
              <h3>색상 설정</h3>
              <div className={styles.colorGrid}>
                <div className={styles.colorInput}>
                  <label>Title 색상</label>
                  <input
                    type='color'
                    value={formData.theme_colors.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, title: e.target.value },
                      }))
                    }
                  />
                  <input
                    type='text'
                    value={formData.theme_colors.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, title: e.target.value },
                      }))
                    }
                    placeholder='#000000'
                    className={styles.colorText}
                  />
                </div>
                <div className={styles.colorInput}>
                  <label>Description 색상</label>
                  <input
                    type='color'
                    value={formData.theme_colors.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, description: e.target.value },
                      }))
                    }
                  />
                  <input
                    type='text'
                    value={formData.theme_colors.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, description: e.target.value },
                      }))
                    }
                    placeholder='#000000'
                    className={styles.colorText}
                  />
                </div>
                <div className={styles.colorInput}>
                  <label>Content Section Title 색상</label>
                  <input
                    type='color'
                    value={formData.theme_colors.contentTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, contentTitle: e.target.value },
                      }))
                    }
                  />
                  <input
                    type='text'
                    value={formData.theme_colors.contentTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, contentTitle: e.target.value },
                      }))
                    }
                    placeholder='#000000'
                    className={styles.colorText}
                  />
                </div>
                <div className={styles.colorInput}>
                  <label>Content Paragraphs 색상</label>
                  <input
                    type='color'
                    value={formData.theme_colors.contentParagraph}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, contentParagraph: e.target.value },
                      }))
                    }
                  />
                  <input
                    type='text'
                    value={formData.theme_colors.contentParagraph}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        theme_colors: { ...prev.theme_colors, contentParagraph: e.target.value },
                      }))
                    }
                    placeholder='#000000'
                    className={styles.colorText}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input
                  type='checkbox'
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_published: e.target.checked }))
                  }
                />
                <span>공개</span>
              </label>
              <small>체크 해제 시 Header 메뉴에서 숨김</small>
            </div>
          </>
        )}
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
          {loading ? 'Saving...' : 'Update Page'}
        </button>
      </div>
    </form>
  );
}
