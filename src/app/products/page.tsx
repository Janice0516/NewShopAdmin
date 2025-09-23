'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
}

// 模拟商品数据
const mockProducts: Product[] = [
  {
    id: '1',
    name: '小米智能台灯Pro',
    price: 299,
    originalPrice: 399,
    image: '💡',
    category: 'lighting',
    rating: 4.8,
    reviews: 1234,
    inStock: true
  },
  {
    id: '2',
    name: '米家智能摄像头',
    price: 199,
    image: '📹',
    category: 'security',
    rating: 4.6,
    reviews: 856,
    inStock: true
  },
  {
    id: '3',
    name: '石头扫地机器人',
    price: 2499,
    originalPrice: 2999,
    image: '🧹',
    category: 'cleaning',
    rating: 4.9,
    reviews: 2341,
    inStock: true
  },
  {
    id: '4',
    name: '小爱音箱Pro',
    price: 399,
    image: '🔊',
    category: 'audio',
    rating: 4.7,
    reviews: 1567,
    inStock: false
  },
  {
    id: '5',
    name: '米家智能门锁',
    price: 1299,
    image: '🔐',
    category: 'security',
    rating: 4.5,
    reviews: 432,
    inStock: true
  },
  {
    id: '6',
    name: '智能空气净化器',
    price: 899,
    originalPrice: 1199,
    image: '🌪️',
    category: 'appliance',
    rating: 4.8,
    reviews: 987,
    inStock: true
  }
]

const categories = [
  { id: 'all', name: '全部分类' },
  { id: 'lighting', name: '智能灯具' },
  { id: 'security', name: '安防监控' },
  { id: 'cleaning', name: '清洁设备' },
  { id: 'audio', name: '智能音响' },
  { id: 'appliance', name: '智能家电' }
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let filtered = products

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // 排序
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        filtered = [...filtered].sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              智能家居商城
            </Link>
            <nav className="flex space-x-8">
              <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                购物车
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                登录
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题和搜索 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">智能家居产品</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索产品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* 过滤器按钮 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              筛选
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏筛选 */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* 分类筛选 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">商品分类</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 排序 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">排序方式</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="default">默认排序</option>
                  <option value="price-low">价格从低到高</option>
                  <option value="price-high">价格从高到低</option>
                  <option value="rating">评分最高</option>
                  <option value="reviews">评价最多</option>
                </select>
              </div>
            </div>
          </div>

          {/* 产品网格 */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                共找到 {filteredProducts.length} 个产品
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center text-6xl">
                      {product.image}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-red-600">
                            ¥{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ¥{product.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        {!product.inStock && (
                          <span className="text-sm text-red-500">缺货</span>
                        )}
                      </div>

                      <button
                        disabled={!product.inStock}
                        className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {product.inStock ? '加入购物车' : '暂时缺货'}
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">没有找到符合条件的产品</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setSortBy('default')
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-500"
                >
                  清除所有筛选条件
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}