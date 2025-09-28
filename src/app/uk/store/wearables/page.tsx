'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ClosableBanner from '@/components/ClosableBanner'
import DynamicSpacer from '@/components/DynamicSpacer'
import '@/styles/navbar.css'
import { ChevronLeftIcon, StarIcon, ShoppingCartIcon, HeartIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  isNew?: boolean
  hasOffer?: boolean
  offerText?: string
  badge?: string
  category: 'smartwatch' | 'fitness' | 'earbuds'
  specs: {
    battery: string
    connectivity: string
    features: string
    compatibility: string
  }
}

export default function WearablesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  const wearables: Product[] = [
    {
      id: '1',
      name: 'Xiaomi Watch 2 Pro',
      price: 299,
      originalPrice: 349,
      image: '/images/xiaomi-watch-2-pro.jpg',
      rating: 4.6,
      reviews: 567,
      isNew: true,
      category: 'smartwatch',
      badge: 'Pro',
      specs: {
        battery: '7 days',
        connectivity: 'GPS, WiFi, Bluetooth',
        features: 'Health monitoring, Calls',
        compatibility: 'Android, iOS'
      }
    },
    {
      id: '2',
      name: 'Xiaomi Smart Band 8 Pro',
      price: 79,
      originalPrice: 99,
      image: '/images/xiaomi-band-8-pro.jpg',
      rating: 4.5,
      reviews: 1234,
      hasOffer: true,
      offerText: '20% off for students',
      category: 'fitness',
      badge: 'Popular',
      specs: {
        battery: '14 days',
        connectivity: 'Bluetooth 5.3',
        features: '150+ workout modes',
        compatibility: 'Android, iOS'
      }
    },
    {
      id: '3',
      name: 'Xiaomi Buds 5',
      price: 129,
      originalPrice: 159,
      image: '/images/xiaomi-buds-5.jpg',
      rating: 4.7,
      reviews: 892,
      isNew: true,
      category: 'earbuds',
      badge: 'New',
      specs: {
        battery: '10h + 40h case',
        connectivity: 'Bluetooth 5.4',
        features: 'ANC, Spatial Audio',
        compatibility: 'Universal'
      }
    },
    {
      id: '4',
      name: 'Redmi Watch 4',
      price: 89,
      originalPrice: 119,
      image: '/images/redmi-watch-4.jpg',
      rating: 4.3,
      reviews: 445,
      category: 'smartwatch',
      hasOffer: true,
      offerText: 'Free strap included',
      badge: 'Value',
      specs: {
        battery: '12 days',
        connectivity: 'GPS, Bluetooth',
        features: '100+ sports modes',
        compatibility: 'Android, iOS'
      }
    },
    {
      id: '5',
      name: 'Redmi Buds 5 Pro',
      price: 69,
      originalPrice: 89,
      image: '/images/redmi-buds-5-pro.jpg',
      rating: 4.4,
      reviews: 678,
      category: 'earbuds',
      specs: {
        battery: '9h + 36h case',
        connectivity: 'Bluetooth 5.3',
        features: 'ANC, Hi-Res Audio',
        compatibility: 'Universal'
      }
    },
    {
      id: '6',
      name: 'Xiaomi Smart Band 8 Active',
      price: 39,
      originalPrice: 49,
      image: '/images/xiaomi-band-8-active.jpg',
      rating: 4.2,
      reviews: 567,
      category: 'fitness',
      badge: 'Budget',
      specs: {
        battery: '14 days',
        connectivity: 'Bluetooth 5.1',
        features: '50+ workout modes',
        compatibility: 'Android, iOS'
      }
    }
  ]

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const catRes = await fetch('/api/categories', { cache: 'no-store' })
        const cats = await catRes.json()
        const matchNames = ['穿戴设备/手表', 'Wearables', 'Wearable', 'Electronics']
        const target = Array.isArray(cats)
          ? (cats.find((c: any) => c.code === 'wearable') ||
             cats.find((c: any) => {
               const raw = c.name || ''
               const lower = raw.toLowerCase()
               return matchNames.includes(raw) || matchNames.map((n: string) => n.toLowerCase()).includes(lower)
             }))
          : null
        const url = target ? `/api/products?limit=100&category=${encodeURIComponent(target.id)}` : '/api/products?limit=100'
        const res = await fetch(url, { cache: 'no-store' })
        const json = await res.json()
        const apiProducts = (json?.data?.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          originalPrice: undefined,
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/file.svg',
          rating: 4.5,
          reviews: p._count?.orderItems || 0,
          isNew: false,
          hasOffer: false,
          offerText: undefined,
          badge: undefined,
          category: 'smartwatch',
          specs: { battery: '', connectivity: '', features: '', compatibility: '' }
        }))
        setProducts(apiProducts)
      } catch (e) {
        console.error('Failed to load wearables:', e)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filteredProducts = products.filter(product => {
    const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter
    
    let priceMatch = true
    if (priceRange === 'under-100' && product.price >= 100) priceMatch = false
    if (priceRange === '100-200' && (product.price < 100 || product.price >= 200)) priceMatch = false
    if (priceRange === 'over-200' && product.price < 200) priceMatch = false
    
    return categoryMatch && priceMatch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      default:
        return 0
    }
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'smartwatch':
        return '⌚'
      case 'fitness':
        return '🏃'
      case 'earbuds':
        return '🎧'
      default:
        return '📱'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClosableBanner className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-sm text-yellow-800">
          ⌚ 可穿戴设备频道提示：商品信息以后台数据为准
        </div>
      </ClosableBanner>
      <Navbar />
      <DynamicSpacer />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/uk/store" className="hover:text-gray-900">UK Store</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Wearables</span>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Wearables</h1>
            <p className="text-xl text-purple-200 mb-8">
              Smart watches, fitness bands, and wireless earbuds for your active lifestyle
            </p>
            <div className="flex justify-center">
              <div className="bg-orange-600 px-6 py-2 rounded-full">
                <span className="font-semibold">Health monitoring made simple</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`pb-2 border-b-2 font-medium text-sm ${
                categoryFilter === 'all'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All Wearables
            </button>
            <button
              onClick={() => setCategoryFilter('smartwatch')}
              className={`pb-2 border-b-2 font-medium text-sm ${
                categoryFilter === 'smartwatch'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Smart Watches
            </button>
            <button
              onClick={() => setCategoryFilter('fitness')}
              className={`pb-2 border-b-2 font-medium text-sm ${
                categoryFilter === 'fitness'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Fitness Bands
            </button>
            <button
              onClick={() => setCategoryFilter('earbuds')}
              className={`pb-2 border-b-2 font-medium text-sm ${
                categoryFilter === 'earbuds'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Earbuds
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Prices</option>
                <option value="under-100">Under £100</option>
                <option value="100-200">£100 - £200</option>
                <option value="over-200">Over £200</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {products.length} wearables
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading wearables...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Product Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.hasOffer 
                        ? 'bg-red-500 text-white' 
                        : product.isNew 
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-6xl">{getCategoryIcon(product.category)}</span>
                    </div>
                  </div>
                  
                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-1 gap-2 mb-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Battery:</span> {product.specs.battery}
                    </div>
                    <div>
                      <span className="font-medium">Connectivity:</span> {product.specs.connectivity}
                    </div>
                    <div>
                      <span className="font-medium">Features:</span> {product.specs.features}
                    </div>
                    <div>
                      <span className="font-medium">Compatible:</span> {product.specs.compatibility}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      £{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        £{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Offer Text */}
                  {product.hasOffer && product.offerText && (
                    <p className="text-sm text-orange-600 mb-4 font-medium">
                      {product.offerText}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center">
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                    <Link
                      href={`/uk/store/wearables/${product.id}`}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}