'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { nanoid } from 'nanoid'
import { createClient } from '@/lib/supabase/client'
import { STORAGE } from '@/lib/data'
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

    const supabase = createClient()

    const uploadPromises = acceptedFiles.map(async (file, index) => {
      // File validation
      const maxSize = 100 * 1024 * 1024 // 100MB
      if (file.size > maxSize) {
        throw new Error(`File ${file.name} is too large (max 100MB)`)
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File ${file.name} has invalid type`)
      }

      // Generate filename
      const ext = file.name.split('.').pop()
      const fileName = `${nanoid()}.${ext}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      // Upload directly to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE.BUCKET_NAME).getPublicUrl(filePath)

      setProgress(((index + 1) / acceptedFiles.length) * 100)
      return publicUrl
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
