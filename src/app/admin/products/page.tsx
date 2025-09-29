'use client'

import { useState, useEffect, useMemo } from 'react'
import AddProductModal from '@/components/AddProductModal'
import { useRealTimeSync } from '@/hooks/useRealTimeSync'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  image: string
  createdAt: string
  sales: number
  rating: number
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [successBanner, setSuccessBanner] = useState('')

  const productsPerPage = 10

  // 使用实时同步Hook获取商品数据
  const { 
    data: apiData, 
    loading, 
    error: syncError, 
    refresh: refreshProducts,
    addItem: addProduct,
    updateItem: updateProduct,
    removeItem: removeProduct
  } = useRealTimeSync<any>({
    endpoint: '/api/products',
    pollInterval: 5000,
    onUpdate: (data) => {
      console.log('商品数据实时更新:', data.products?.length || 0, '个商品')
    },
    onError: (error) => {
      console.error('商品数据同步失败:', error)
    }
  })

  // 转换API数据格式为前端显示格式并存入本地状态，便于后续操作与UI交互
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    if (!apiData?.products) {
      setProducts([])
      return
    }
    const mapped = apiData.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
      // 修复：优先使用分类名称
      category: product.category?.name || product.categoryId,
      // 新增：品牌中文优先取后端 brandText
      brand: product.brandText || '未知品牌',
      stock: product.stock,
      // 新增：优先使用后端提供的 status
      status: product.status || (product.stock === 0 ? 'out_of_stock' : (product.isActive ? 'active' : 'inactive')),
      image: product.images?.[0] || '📦',
      createdAt: new Date(product.createdAt).toLocaleDateString(),
      sales: product.sold || 0,
      rating: 4.5
    }))
    setProducts(mapped)
  }, [apiData])

  // 获取所有分类
  const categories = Array.from(new Set(products.map(p => p.category)))

  // 过滤商品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // 分页
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(paginatedProducts.map(product => product.id))
    }
  }

  // 处理商品添加成功后的实时更新
  const handleProductAdded = (newProduct: any) => {
    const formattedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      // 修复：优先使用分类名称
      category: newProduct.category?.name || newProduct.categoryId,
      // 新增：品牌中文优先取后端 brandText
      brand: newProduct.brandText || '未知品牌',
      stock: newProduct.stock,
      // 新增：优先使用后端提供的 status
      status: newProduct.status || (newProduct.stock === 0 ? 'out_of_stock' : (newProduct.isActive ? 'active' : 'inactive')),
      image: newProduct.images?.[0] || '📦',
      createdAt: new Date(newProduct.createdAt).toLocaleDateString(),
      sales: newProduct.sold || 0,
      rating: 4.5
    }
    addProduct(formattedProduct)
    setShowAddModal(false)
    refreshProducts()
    setSuccessBanner('Product added successfully!')
    setTimeout(() => setSuccessBanner(''), 3000)
  }

  const handleAddSuccess = () => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data?.products) {
            const formattedProducts: Product[] = result.data.products.map((product: any) => ({
              id: product.id,
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
              // 修复：优先使用分类名称
              category: product.category?.name || product.categoryId,
              // 新增：品牌中文优先取后端 brandText
              brand: product.brandText || '未知品牌',
              stock: product.stock,
              // 新增：优先使用后端提供的 status
              status: product.status || (product.stock === 0 ? 'out_of_stock' : (product.isActive ? 'active' : 'inactive')),
              image: product.images?.[0] || '📦',
              createdAt: new Date(product.createdAt).toLocaleDateString(),
              sales: product.sold || 0,
              rating: 4.5
            }))
            setProducts(formattedProducts)
          }
        }
      } catch (error) {
        console.error('重新获取商品数据出错:', error)
      }
    }
    
    fetchProducts()
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId))
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  const handleBatchDelete = () => {
    if (selectedProducts.length === 0) return
    if (confirm(`Are you sure you want to delete the selected ${selectedProducts.length} products?`)) {
      setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)))
      setSelectedProducts([])
    }
  }

  const handleToggleStatus = (productId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ))
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '上架'
      case 'inactive': return '下架'
      case 'out_of_stock': return '缺货'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 图片解析与预览模态框状态
  const resolveImageSrc = (image: string) => {
    if (!image) return '/file.svg'
    const trimmed = String(image).trim()
    if (
      trimmed.startsWith('http') ||
      trimmed.startsWith('/') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:')
    ) {
      return trimmed
    }
    return '/file.svg'
  }

  // 新增：安全描述提取，避免将图片链接或 blob 文本当作描述渲染
  const getSafeDescription = (desc?: string) => {
    const t = (desc || '').trim()
    if (!t) return ''
    const looksLikeUrl = t.startsWith('http') || t.startsWith('blob:') || t.startsWith('data:') || t.startsWith('/')
    return looksLikeUrl ? '' : t
  }
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')
  const [previewName, setPreviewName] = useState('')
  const [zoom, setZoom] = useState(1)

  const openPreview = (src: string, name: string) => {
    setPreviewSrc(resolveImageSrc(src))
    setPreviewName(name)
    setZoom(1)
    setPreviewOpen(true)
  }

  const closePreview = () => setPreviewOpen(false)

  const handleWheel = (e: any) => {
    e.preventDefault()
    setZoom((prev) => Math.min(5, Math.max(0.5, prev + (e.deltaY < 0 ? 0.1 : -0.1))))
  }

  return (
    <div className="space-y-6">
      {successBanner && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successBanner}
        </div>
      )}
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-600">管理商城中的所有商品</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          添加商品
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">商品总数</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <PhotoIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">上架商品</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <PhotoIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">缺货商品</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => p.status === 'out_of_stock').length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <PhotoIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总库存</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <PhotoIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有分类</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有状态</option>
            <option value="active">上架</option>
            <option value="inactive">下架</option>
            <option value="out_of_stock">缺货</option>
          </select>
          
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              删除选中 ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类/品牌
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  价格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  库存
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  销量/评分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-4 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                        <img
                           src={resolveImageSrc(product.image)}
                           alt={product.name}
                           className="w-full h-full object-cover"
                           loading="lazy"
                           onError={(ev) => { const img = ev.currentTarget as HTMLImageElement; img.src = '/file.svg'; img.classList.remove('object-cover'); img.classList.add('object-contain'); }}
                           onClick={() => openPreview(product.image, product.name)}
                           style={{ cursor: 'zoom-in' }}
                         />
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-900">{product.name}</div>
                        {getSafeDescription(product.description) && (
                          <div className="text-sm text-gray-500 max-w-xs truncate" title={getSafeDescription(product.description)}>
                            {getSafeDescription(product.description)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.category}</div>
                    <div className="text-sm text-gray-500">{product.brand}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">¥{product.price}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        ¥{product.originalPrice}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${
                      product.stock > 50 ? 'text-green-600' : 
                      product.stock > 10 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">销量: {product.sales}</div>
                    <div className="text-sm text-gray-500">评分: {product.rating}⭐</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`text-sm px-2 py-1 rounded ${
                          product.status === 'active' 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {product.status === 'active' ? '下架' : '上架'}
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 图片预览模态框 */}
        {previewOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center" onClick={closePreview}>
            <div className="relative bg-white rounded-lg shadow-xl p-4 max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">{previewName}</h3>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200" onClick={() => setZoom(z => Math.min(5, z + 0.1))}>+</button>
                  <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>-</button>
                  <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200" onClick={() => setZoom(1)}>Reset</button>
                  <button className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200" onClick={closePreview}>Close</button>
                </div>
              </div>
              <div className="overflow-auto" onWheel={handleWheel} style={{ maxWidth: '85vw', maxHeight: '70vh' }}>
                <img
                  src={resolveImageSrc(previewSrc)}
                  alt={previewName}
                  className="mx-auto object-contain"
                  style={{ transform: `scale(${zoom})`, transition: 'transform 150ms ease', transformOrigin: 'center center' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 {startIndex + 1} 到 {Math.min(startIndex + productsPerPage, filteredProducts.length)} 条，
                共 {filteredProducts.length} 条记录
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="text-sm text-gray-700">
                  第 {currentPage} 页，共 {totalPages} 页
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add product modal */}
      {showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleProductAdded}
        />
      )}
    </div>
  )
}