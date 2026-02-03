'use client';

import { PageContent, PageSection } from '@/types';
import { nanoid } from 'nanoid';
import styles from './PageContentEditor.module.css';

interface PageContentEditorProps {
  content: PageContent | null;
  onChange: (content: PageContent) => void;
}

export default function PageContentEditor({ content, onChange }: PageContentEditorProps) {
  const sections = content?.sections || [];

  function addSection() {
    const newSection: PageSection = {
      id: nanoid(),
      title: '',
      paragraphs: [''],
    };
    onChange({
      sections: [...sections, newSection],
    });
  }

  function removeSection(sectionId: string) {
    onChange({
      sections: sections.filter((s) => s.id !== sectionId),
    });
  }

  function updateSectionTitle(sectionId: string, title: string) {
    onChange({
      sections: sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
    });
  }

  function addParagraph(sectionId: string) {
    onChange({
      sections: sections.map((s) =>
        s.id === sectionId ? { ...s, paragraphs: [...s.paragraphs, ''] } : s
      ),
    });
  }

  function removeParagraph(sectionId: string, paragraphIndex: number) {
    onChange({
      sections: sections.map((s) =>
        s.id === sectionId
          ? { ...s, paragraphs: s.paragraphs.filter((_, i) => i !== paragraphIndex) }
          : s
      ),
    });
  }

  function updateParagraph(sectionId: string, paragraphIndex: number, text: string) {
    onChange({
      sections: sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              paragraphs: s.paragraphs.map((p, i) => (i === paragraphIndex ? text : p)),
            }
          : s
      ),
    });
  }

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <h3>Content Sections</h3>
        <button type="button" onClick={addSection} className={styles.addSectionBtn}>
          + Add Section
        </button>
      </div>

      {sections.length === 0 && (
        <div className={styles.empty}>
          <p>No content sections yet. Click &quot;Add Section&quot; to create one.</p>
        </div>
      )}

      {sections.map((section, sectionIndex) => (
        <div key={section.id} className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>Section {sectionIndex + 1}</span>
            <button
              type="button"
              onClick={() => removeSection(section.id)}
              className={styles.removeBtn}
              title="Remove section"
            >
              ×
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Section Title (h2)</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              placeholder="Enter section title..."
            />
          </div>

          <div className={styles.paragraphs}>
            <div className={styles.paragraphsHeader}>
              <label>Paragraphs</label>
              <button
                type="button"
                onClick={() => addParagraph(section.id)}
                className={styles.addParagraphBtn}
              >
                + Add Paragraph
              </button>
            </div>

            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <div key={paragraphIndex} className={styles.paragraph}>
                <div className={styles.paragraphHeader}>
                  <span className={styles.paragraphLabel}>Paragraph {paragraphIndex + 1}</span>
                  {section.paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(section.id, paragraphIndex)}
                      className={styles.removeBtn}
                      title="Remove paragraph"
                    >
                      ×
                    </button>
                  )}
                </div>
                <textarea
                  value={paragraph}
                  onChange={(e) => updateParagraph(section.id, paragraphIndex, e.target.value)}
                  rows={3}
                  placeholder="Enter paragraph text..."
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
