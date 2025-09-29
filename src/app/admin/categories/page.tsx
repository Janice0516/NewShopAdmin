'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRealTimeSync } from '@/hooks/useRealTimeSync'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline'

interface CategoryItem {
  id: string
  name: string
  description?: string
  isActive?: boolean
  code?: string
}

function mapCategoryCode(name?: string): string {
  const raw = (name || '').trim()
  const n = raw.toLowerCase()
  if (raw === '穿戴设备/手表' || n === 'wearable' || n === 'wearables') return 'wearable'
  if (raw === '智能家居' || n === 'smart home' || n === 'home goods') return 'smart_home'
  if (raw === '生活用品' || n === 'life style' || n === 'lifestyle') return 'life_style'
  return n.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'uncategorized'
}

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null)
  const [successBanner, setSuccessBanner] = useState('')

  const {
    data: apiData,
    loading,
    error: syncError,
    refresh,
  } = useRealTimeSync<any>({
    endpoint: '/api/categories',
    pollInterval: 5000,
    onUpdate: (data) => {
      console.log('分类数据实时更新:', Array.isArray(data) ? data.length : 0)
    },
    onError: (error) => {
      console.error('分类数据同步失败:', error)
    }
  })

  const [categories, setCategories] = useState<CategoryItem[]>([])
  useEffect(() => {
    if (!apiData) {
      setCategories([])
      return
    }
    const list: CategoryItem[] = Array.isArray(apiData) ? apiData.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      isActive: c.isActive ?? true,
      code: c.code || mapCategoryCode(c.name)
    })) : []
    setCategories(list)
  }, [apiData])

  const filtered = useMemo(() => {
    const k = searchTerm.trim().toLowerCase()
    if (!k) return categories
    return categories.filter(c => c.name.toLowerCase().includes(k) || (c.description || '').toLowerCase().includes(k) || (c.code || '').includes(k))
  }, [categories, searchTerm])

  const handleCreate = async (payload: { name: string; description?: string }) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error || '创建分类失败')
      setSuccessBanner('分类创建成功！')
      setShowAddModal(false)
      refresh()
      setTimeout(() => setSuccessBanner(''), 3000)
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const handleUpdate = async (id: string, payload: Partial<CategoryItem>) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error || '更新分类失败')
      setSuccessBanner('分类更新成功！')
      setEditingItem(null)
      refresh()
      setTimeout(() => setSuccessBanner(''), 3000)
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error || '删除分类失败')
      setSuccessBanner('分类删除成功！')
      refresh()
      setTimeout(() => setSuccessBanner(''), 3000)
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
          <p className="text-gray-600">维护分类名称与稳定 code 映射</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> 新建分类
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="搜索分类名称/描述/code"
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">共 {filtered.length} 个分类</div>
        </div>
        <div className="divide-y divide-gray-200">
          {filtered.map(c => (
            <div key={c.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ViewColumnsIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.description || '无描述'}</div>
                  <div className="text-xs text-gray-400">code: {c.code || mapCategoryCode(c.name)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingItem(c)}
                  className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <PencilIcon className="h-4 w-4 mr-1" /> 编辑
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="inline-flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-1" /> 删除
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-gray-500">暂无分类</div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">新建分类</h2>
            </div>
            <AddEditForm
              onCancel={() => setShowAddModal(false)}
              onSubmit={(values) => handleCreate(values)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">编辑分类</h2>
            </div>
            <AddEditForm
              initial={{ name: editingItem.name, description: editingItem.description }}
              onCancel={() => setEditingItem(null)}
              onSubmit={(values) => handleUpdate(editingItem.id, values)}
            />
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successBanner && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
          {successBanner}
        </div>
      )}
    </div>
  )
}

function AddEditForm({
  initial,
  onCancel,
  onSubmit
}: {
  initial?: { name?: string; description?: string }
  onCancel: () => void
  onSubmit: (values: { name: string; description?: string }) => void
}) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Category name cannot be empty')
      return
    }
    try {
      setSubmitting(true)
      await onSubmit({ name: name.trim(), description: description.trim() || undefined })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">分类名称</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="例如：穿戴设备/手表、智能家居"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">分类描述</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="可选"
        />
      </div>
      <div className="flex items-center justify-end space-x-2 border-t border-gray-200 p-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">取消</button>
        <button type="submit" disabled={submitting} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
          {submitting ? '提交中...' : '提交'}
        </button>
      </div>
    </form>
  )
}