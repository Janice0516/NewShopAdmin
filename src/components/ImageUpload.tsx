'use client'

import { useState, useRef, useCallback } from 'react'
import { compressImage, generateThumbnail, createPreviewUrl, revokePreviewUrl, isImageFile, formatFileSize } from '@/utils/imageUtils'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  maxFileSize?: number // MB
  onError?: (error: string) => void
}

interface UploadedImage {
  id: string
  file: File
  preview: string
  thumbnail?: string
  compressed?: File
  dataUrl?: string
  uploading: boolean
  progress: number
  error?: string
}

export default function ImageUpload({ 
  images, 
  onChange, 
  maxImages = 5, 
  maxFileSize = 5,
  onError 
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 将 File 转换为 data URL，便于持久化存储
  const fileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('图片转换失败'))
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFileSelect = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files)
    
    // 检查文件数量限制
    if (uploadedImages.length + fileArray.length > maxImages) {
      onError?.(`最多只能上传 ${maxImages} 张图片`)
      return
    }

    for (const file of fileArray) {
      // 检查文件类型
      if (!isImageFile(file)) {
        onError?.(`文件 ${file.name} 不是有效的图片格式`)
        continue
      }

      // 检查文件大小
      if (file.size > maxFileSize * 1024 * 1024) {
        onError?.(`文件 ${file.name} 大小超过 ${maxFileSize}MB 限制`)
        continue
      }

      const imageId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const preview = createPreviewUrl(file)

      const newImage: UploadedImage = {
        id: imageId,
        file,
        preview,
        uploading: true,
        progress: 0
      }

      setUploadedImages(prev => [...prev, newImage])

      try {
        // 生成缩略图
        const thumbnail = await generateThumbnail(file, { width: 150, height: 150 })
        
        // 压缩图片
        const compressed = await compressImage(file, { 
          maxWidth: 800, 
          maxHeight: 800, 
          quality: 0.8 
        })

        // 转换为 data URL 以持久化（避免 blob URL 刷新失效）
        const dataUrl = await fileToDataUrl(compressed)

        setUploadedImages(prev => prev.map(img => 
          img.id === imageId 
            ? { ...img, thumbnail, compressed, dataUrl, uploading: false, progress: 100 }
            : img
        ))

        // 更新父组件的图片列表（使用 data URL）
        onChange([...images, dataUrl])

      } catch (error) {
        setUploadedImages(prev => prev.map(img => 
          img.id === imageId 
            ? { ...img, uploading: false, error: '图片处理失败' }
            : img
        ))
        onError?.(`图片 ${file.name} 处理失败`)
      }
    }
  }, [uploadedImages, maxImages, maxFileSize, onError, images, onChange, fileToDataUrl])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const removeImage = useCallback((imageId: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId)
      if (imageToRemove) {
        // 清理临时预览资源
        revokePreviewUrl(imageToRemove.preview)
        if (imageToRemove.thumbnail) revokePreviewUrl(imageToRemove.thumbnail)
        if (imageToRemove.compressed) revokePreviewUrl(createPreviewUrl(imageToRemove.compressed))
      }
      return prev.filter(img => img.id !== imageId)
    })

    // 更新父组件的图片列表（使用 data URL）
    const remainingImages = uploadedImages
      .filter(img => img.id !== imageId)
      .map(img => img.dataUrl || img.preview)
    onChange(remainingImages)
  }, [uploadedImages, onChange])

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* 拖拽上传区域 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <div className="space-y-2">
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              点击或拖拽图片到此处上传
            </p>
            <p className="text-xs text-gray-500">
              支持 JPG、PNG、GIF 格式，单个文件不超过 {maxFileSize}MB
            </p>
          </div>
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* 图片预览列表 */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {image.thumbnail ? (
                  <img
                    src={image.thumbnail}
                    alt="预览"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={image.preview}
                    alt="预览"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* 上传进度 */}
                {image.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm">处理中...</p>
                    </div>
                  </div>
                )}

                {/* 错误状态 */}
                {image.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                    <p className="text-white text-sm text-center">{image.error}</p>
                  </div>
                )}

                {/* 删除按钮 */}
                {!image.uploading && (
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* 文件信息 */}
              <div className="mt-2 text-xs text-gray-500">
                <p className="truncate">{image.file.name}</p>
                <p>{formatFileSize(image.file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 图片数量提示 */}
      <div className="text-sm text-gray-500">
        已上传 {uploadedImages.length} / {maxImages} 张图片
      </div>
    </div>
  )
}