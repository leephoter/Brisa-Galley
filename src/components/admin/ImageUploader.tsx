'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './ImageUploader.module.css'

interface ImageUploaderProps {
  folder?: string
  maxFiles?: number
  onUploadComplete?: (urls: string[]) => void
}

export default function ImageUploader({
  folder,
  maxFiles = 80,
  onUploadComplete
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setProgress(0)
    setError(null)

    const uploadPromises = acceptedFiles.map(async (file, index) => {
      const formData = new FormData()
      formData.append('file', file)
      if (folder) formData.append('folder', folder)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const { url } = await response.json()
      setProgress(((index + 1) / acceptedFiles.length) * 100)
      return url
    })

    try {
      const urls = await Promise.all(uploadPromises)
      setUploadedImages(prev => [...prev, ...urls])
      onUploadComplete?.(urls)
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [folder, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: maxFiles - uploadedImages.length,
    disabled: uploading
  })

  return (
    <div className={styles.uploader}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${uploading ? styles.disabled : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <p>Uploading... {Math.round(progress)}%</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className={styles.dropzoneContent}>
            <p className={styles.dropzoneText}>
              {isDragActive
                ? 'Drop the images here...'
                : 'Drag & drop images, or click to select'}
            </p>
            <p className={styles.dropzoneHint}>
              Supports JPG, PNG, WebP (max 100MB per file)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className={styles.uploadedInfo}>
          <p>Uploaded: {uploadedImages.length} images</p>
        </div>
      )}
    </div>
  )
}
