// 图片处理工具函数

export interface ImageCompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export interface ThumbnailOptions {
  width: number
  height: number
  quality?: number
  crop?: boolean
}

// 压缩图片
export async function compressImage(file: File, options: ImageCompressOptions = {}): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // 计算新的尺寸
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('图片压缩失败'))
          }
        },
        `image/${format}`,
        quality
      )
    }

    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

// 生成缩略图
export async function generateThumbnail(file: File, options: ThumbnailOptions): Promise<string> {
  const { width, height, quality = 0.7, crop = true } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = width
      canvas.height = height

      if (crop) {
        // 裁剪模式：保持比例，裁剪多余部分
        const scale = Math.max(width / img.width, height / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const x = (width - scaledWidth) / 2
        const y = (height - scaledHeight) / 2

        ctx?.drawImage(img, x, y, scaledWidth, scaledHeight)
      } else {
        // 拉伸模式：直接缩放到目标尺寸
        ctx?.drawImage(img, 0, 0, width, height)
      }

      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(thumbnailDataUrl)
    }

    img.onerror = () => reject(new Error('缩略图生成失败'))
    img.src = URL.createObjectURL(file)
  })
}

// 图片裁剪
export async function cropImage(
  file: File,
  cropArea: { x: number; y: number; width: number; height: number },
  outputSize?: { width: number; height: number }
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      const { x, y, width, height } = cropArea
      const outputWidth = outputSize?.width || width
      const outputHeight = outputSize?.height || height

      canvas.width = outputWidth
      canvas.height = outputHeight

      // 裁剪并缩放
      ctx?.drawImage(
        img,
        x, y, width, height,
        0, 0, outputWidth, outputHeight
      )

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(croppedFile)
          } else {
            reject(new Error('图片裁剪失败'))
          }
        },
        file.type,
        0.9
      )
    }

    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

// 获取图片信息
export async function getImageInfo(file: File): Promise<{
  width: number
  height: number
  size: number
  type: string
  aspectRatio: number
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        aspectRatio: img.width / img.height
      })
    }

    img.onerror = () => reject(new Error('无法获取图片信息'))
    img.src = URL.createObjectURL(file)
  })
}

// 批量处理图片
export async function batchProcessImages(
  files: File[],
  processor: (file: File) => Promise<File | string>
): Promise<(File | string)[]> {
  const results: (File | string)[] = []
  
  for (const file of files) {
    try {
      const result = await processor(file)
      results.push(result)
    } catch (error) {
      console.error(`处理图片 ${file.name} 失败:`, error)
      throw error
    }
  }
  
  return results
}

// 创建图片预览URL
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

// 清理预览URL
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url)
}

// 检查是否为图片文件
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 图片上传进度跟踪
export class ImageUploadTracker {
  private uploads: Map<string, { progress: number; status: 'pending' | 'uploading' | 'completed' | 'error' }> = new Map()
  private listeners: ((uploads: Map<string, any>) => void)[] = []

  addUpload(id: string) {
    this.uploads.set(id, { progress: 0, status: 'pending' })
    this.notifyListeners()
  }

  updateProgress(id: string, progress: number) {
    const upload = this.uploads.get(id)
    if (upload) {
      upload.progress = progress
      upload.status = progress === 100 ? 'completed' : 'uploading'
      this.notifyListeners()
    }
  }

  setError(id: string) {
    const upload = this.uploads.get(id)
    if (upload) {
      upload.status = 'error'
      this.notifyListeners()
    }
  }

  removeUpload(id: string) {
    this.uploads.delete(id)
    this.notifyListeners()
  }

  onUpdate(listener: (uploads: Map<string, any>) => void) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(new Map(this.uploads)))
  }

  getUploads() {
    return new Map(this.uploads)
  }
}

// 全局上传跟踪器实例
export const uploadTracker = new ImageUploadTracker()