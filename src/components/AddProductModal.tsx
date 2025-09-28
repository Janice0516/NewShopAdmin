'use client'

import { useState, useEffect } from 'react'
import { validateProduct, defaultProductRules, ProductValidationResult } from '@/utils/validation'
import ImageUpload from './ImageUpload'

interface Category {
  id: string
  name: string
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newProduct?: any) => void
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: [] as string[]
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // 实时验证函数
  const validateField = (fieldName: string, value: any) => {
    const fieldData = { ...formData, [fieldName]: value }
    const result = validateProduct(fieldData, defaultProductRules)
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: result.errors[fieldName] || []
    }))
    
    return result.errors[fieldName]?.length === 0
  }

  // 验证所有字段
  const validateAllFields = () => {
    const result = validateProduct(formData, defaultProductRules)
    setValidationErrors(result.errors)
    return result.isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 实时验证
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    validateField(fieldName, formData[fieldName as keyof typeof formData])
  }

  const handleImageChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }))
    
    // 实时验证图片
    if (touched.images) {
      validateField('images', images)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    // 提交前进行完整验证
    const isValid = validateAllFields()
    if (!isValid) {
      setError('请修正表单中的错误后再提交')
      setLoading(false)
      return
    }

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== '')
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess(result.data)
        // 展示成功提示而不是立即关闭
        setSuccessMessage('商品添加成功！您可以继续添加或关闭窗口。')
        // 重置表单，方便继续添加
        setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', images: [] })
      } else {
        if (result.details) {
          setValidationErrors(result.details)
        }
        setError(result.message || result.error || '添加商品失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">添加商品</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <div className="flex items-center justify-between">
              <span>{successMessage}</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => setSuccessMessage('')}
                >继续添加</button>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={onClose}
                >关闭</button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              商品名称 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={() => handleBlur('name')}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                validationErrors.name?.length > 0 ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入商品名称"
            />
            {validationErrors.name?.length > 0 && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              商品描述
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              onBlur={() => handleBlur('description')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                validationErrors.description?.length > 0 ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入商品描述"
            />
            {validationErrors.description?.length > 0 && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.description[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                价格 (元) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                onBlur={() => handleBlur('price')}
                required
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                  validationErrors.price?.length > 0 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {validationErrors.price?.length > 0 && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.price[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                库存数量 *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                onBlur={() => handleBlur('stock')}
                required
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                  validationErrors.stock?.length > 0 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {validationErrors.stock?.length > 0 && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.stock[0]}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              商品分类 *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              onBlur={() => handleBlur('categoryId')}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                validationErrors.categoryId?.length > 0 ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" className="text-gray-500">请选择分类</option>
              {categories.map(category => (
                <option key={category.id} value={category.id} className="text-gray-900">
                  {category.name}
                </option>
              ))}
            </select>
            {validationErrors.categoryId?.length > 0 && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.categoryId[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              商品图片
            </label>
            <ImageUpload
              images={formData.images}
              onChange={handleImageChange}
              maxImages={5}
              maxFileSize={5}
              onError={(error) => setError(error)}
            />
            {validationErrors.images?.length > 0 && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.images[0]}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '添加中...' : '添加商品'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}