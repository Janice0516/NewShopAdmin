'use client'

import { useState, useEffect } from 'react'
import AddProductModal from '@/components/AddProductModal'
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
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const productsPerPage = 10

  useEffect(() => {
    // 获取商品数据
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data?.products) {
            // 转换API数据格式为前端需要的格式
            const formattedProducts: Product[] = result.data.products.map((product: any) => ({
              id: product.id,
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
              category: product.categoryId, // 暂时使用categoryId，后续可以映射为分类名称
              brand: '未知品牌', // API中没有brand字段，使用默认值
              stock: product.stock,
              status: product.isActive ? 'active' : 'inactive',
              image: product.images?.[0] || '📦', // 使用第一张图片或默认图标
              createdAt: new Date(product.createdAt).toLocaleDateString(),
              sales: product.sold || 0,
              rating: 4.5 // 默认评分，API中没有此字段
            }))
            setProducts(formattedProducts)
          }
        } else {
          console.error('获取商品数据失败:', response.statusText)
        }
      } catch (error) {
        console.error('获取商品数据出错:', error)
      }
    }

    fetchProducts()
  }, [])

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

  const handleAddSuccess = () => {
    // 重新加载商品数据
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data?.products) {
            // 转换API数据格式为前端需要的格式
            const formattedProducts: Product[] = result.data.products.map((product: any) => ({
              id: product.id,
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
              category: product.categoryId, // 暂时使用categoryId，后续可以映射为分类名称
              brand: '未知品牌', // API中没有brand字段，使用默认值
              stock: product.stock,
              status: product.isActive ? 'active' : 'inactive',
              image: product.images?.[0] || '📦', // 使用第一张图片或默认图标
              createdAt: new Date(product.createdAt).toLocaleDateString(),
              sales: product.sold || 0,
              rating: 4.5 // 默认评分，API中没有此字段
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
    if (confirm('确定要删除这个商品吗？')) {
      setProducts(prev => prev.filter(product => product.id !== productId))
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  const handleBatchDelete = () => {
    if (selectedProducts.length === 0) return
    if (confirm(`确定要删除选中的 ${selectedProducts.length} 个商品吗？`)) {
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

  return (
    <div className="space-y-6">
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
                      <div className="text-4xl mr-4">{product.image}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {product.description}
                        </div>
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
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} />}
    </div>
  )
}