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
  category: 'security' | 'lighting' | 'cleaning' | 'entertainment' | 'kitchen'
  specs: {
    connectivity: string
    compatibility: string
    power: string
    features: string
  }
}

export default function SmartHomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  const smartHomeProducts: Product[] = [
    {
      id: '1',
      name: 'Xiaomi Smart Camera C500 Pro',
      price: 89,
      originalPrice: 109,
      image: '/images/xiaomi-camera-c500-pro.jpg',
      rating: 4.6,
      reviews: 892,
      isNew: true,
      category: 'security',
      badge: 'Pro',
      specs: {
        connectivity: 'Wi-Fi 6, Bluetooth',
        compatibility: 'Mi Home, Alexa, Google',
        power: 'USB-C',
        features: '4K, Night Vision, AI Detection'
      }
    },
    {
      id: '2',
      name: 'Mi Smart LED Bulb Essential',
      price: 19,
      originalPrice: 25,
      image: '/images/mi-smart-bulb.jpg',
      rating: 4.4,
      reviews: 1567,
      category: 'lighting',
      hasOffer: true,
      offerText: 'Buy 3 get 1 free',
      badge: 'Bundle',
      specs: {
        connectivity: 'Wi-Fi 2.4GHz',
        compatibility: 'Mi Home, Alexa, Google',
        power: '9W LED',
        features: '16M colors, Voice control'
      }
    },
    {
      id: '3',
      name: 'Xiaomi Robot Vacuum X20+',
      price: 449,
      originalPrice: 549,
      image: '/images/xiaomi-vacuum-x20.jpg',
      rating: 4.8,
      reviews: 678,
      isNew: true,
      category: 'cleaning',
      badge: 'New',
      specs: {
        connectivity: 'Wi-Fi, App Control',
        compatibility: 'Mi Home App',
        power: '5200mAh Battery',
        features: 'Auto-empty, Mopping, Mapping'
      }
    },
    {
      id: '4',
      name: 'Mi TV Stick 4K',
      price: 59,
      originalPrice: 79,
      image: '/images/mi-tv-stick-4k.jpg',
      rating: 4.5,
      reviews: 1234,
      category: 'entertainment',
      hasOffer: true,
      offerText: 'Free 3 months Netflix',
      badge: '4K',
      specs: {
        connectivity: 'Wi-Fi 5, Bluetooth 5.0',
        compatibility: 'Android TV 11',
        power: 'USB powered',
        features: '4K HDR, Dolby Vision, Voice Remote'
      }
    },
    {
      id: '5',
      name: 'Xiaomi Smart Air Fryer Pro',
      price: 129,
      originalPrice: 159,
      image: '/images/xiaomi-air-fryer-pro.jpg',
      rating: 4.7,
      reviews: 445,
      category: 'kitchen',
      badge: 'Pro',
      specs: {
        connectivity: 'Wi-Fi, App Control',
        compatibility: 'Mi Home App',
        power: '1500W',
        features: '6.5L capacity, 8 presets, Timer'
      }
    },
    {
      id: '6',
      name: 'Mi Smart Door Lock Pro',
      price: 199,
      originalPrice: 249,
      image: '/images/mi-door-lock-pro.jpg',
      rating: 4.6,
      reviews: 567,
      category: 'security',
      hasOffer: true,
      offerText: 'Professional installation included',
      badge: 'Installation',
      specs: {
        connectivity: 'Bluetooth, NFC',
        compatibility: 'Mi Home, Fingerprint',
        power: '4x AA batteries',
        features: 'Fingerprint, Password, Card, Key'
      }
    },
    {
      id: '7',
      name: 'Xiaomi Smart Ceiling Light',
      price: 79,
      originalPrice: 99,
      image: '/images/xiaomi-ceiling-light.jpg',
      rating: 4.3,
      reviews: 334,
      category: 'lighting',
      specs: {
        connectivity: 'Wi-Fi 2.4GHz',
        compatibility: 'Mi Home, Voice control',
        power: '72W LED',
        features: 'Adjustable brightness, Color temp'
      }
    },
    {
      id: '8',
      name: 'Mi Smart Speaker IR Control',
      price: 39,
      originalPrice: 49,
      image: '/images/mi-smart-speaker-ir.jpg',
      rating: 4.2,
      reviews: 789,
      category: 'entertainment',
      badge: 'Voice',
      specs: {
        connectivity: 'Wi-Fi, Bluetooth, IR',
        compatibility: 'Mi AI, Smart home devices',
        power: 'AC adapter',
        features: 'Voice control, IR blaster, Music'
      }
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // 获取分类，优先匹配中文“智能家居”，否则回退英文别名
        const catRes = await fetch('/api/categories', { cache: 'no-store' })
        const cats = await catRes.json()
        const matchNames = ['智能家居', 'Smart Home', 'Home Goods']
        const target = Array.isArray(cats)
          ? (cats.find((c: any) => c.code === 'smart_home') ||
             cats.find((c: any) => {
               const raw = c.name || ''
               const lower = raw.toLowerCase()
               return matchNames.includes(raw) || matchNames.map((n: string) => n.toLowerCase()).includes(lower)
             }))
          : null
        const url = target
          ? `/api/products?limit=100&category=${encodeURIComponent(target.id)}`
          : '/api/products?limit=100'

        const res = await fetch(url, { cache: 'no-store' })
        const json = await res.json()

        const inferCategory = (name: string): Product['category'] => {
          const n = (name || '').toLowerCase()
          if (n.includes('camera') || n.includes('lock')) return 'security'
          if (n.includes('bulb') || n.includes('light') || n.includes('ceiling')) return 'lighting'
          if (n.includes('vacuum') || n.includes('robot')) return 'cleaning'
          if (n.includes('tv') || n.includes('stick') || n.includes('speaker')) return 'entertainment'
          if (n.includes('fryer') || n.includes('kitchen')) return 'kitchen'
          return 'entertainment'
        }

        const apiProducts = (json?.data?.products || []).map((p: any) => {
          const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/file.svg'
          return {
            id: p.id,
            name: p.name,
            price: Number(p.price) || 0,
            originalPrice: undefined,
            image: firstImage,
            rating: 4.5,
            reviews: p._count?.orderItems || 0,
            isNew: false,
            hasOffer: false,
            offerText: undefined,
            badge: undefined,
            category: inferCategory(p.name),
            specs: { connectivity: '', compatibility: '', power: '', features: '' }
          } as Product
        })
        setProducts(apiProducts)
      } catch (e) {
        console.error('Failed to load smart-home products:', e)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter
    
    let priceMatch = true
    if (priceRange === 'under-50' && product.price >= 50) priceMatch = false
    if (priceRange === '50-150' && (product.price < 50 || product.price >= 150)) priceMatch = false
    if (priceRange === 'over-150' && product.price < 150) priceMatch = false
    
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
      case 'security':
        return '🔒'
      case 'lighting':
        return '💡'
      case 'cleaning':
        return '🧹'
      case 'entertainment':
        return '📺'
      case 'kitchen':
        return '🍳'
      default:
        return '🏠'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <ClosableBanner className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-sm text-yellow-800">
          🏠 智能家居提示：请以后台商品数据为准
        </div>
      </ClosableBanner>
      <Navbar />
      <DynamicSpacer />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/uk/store" className="text-gray-600 hover:text-orange-600">
              Store
            </Link>
            <ChevronLeftIcon className="h-4 w-4 text-gray-400 rotate-180" />
            <span className="text-gray-900 font-medium">Smart Home</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Smart Home</h1>
            <p className="text-xl text-green-200 mb-8">
              Transform your home with intelligent devices and seamless automation
            </p>
            <div className="flex justify-center">
              <div className="bg-orange-600 px-6 py-2 rounded-full">
                <span className="font-semibold">Works with Mi Home ecosystem</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4 overflow-x-auto">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setCategoryFilter('security')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'security'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setCategoryFilter('lighting')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'lighting'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Lighting
            </button>
            <button
              onClick={() => setCategoryFilter('cleaning')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'cleaning'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Cleaning
            </button>
            <button
              onClick={() => setCategoryFilter('entertainment')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'entertainment'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Entertainment
            </button>
            <button
              onClick={() => setCategoryFilter('kitchen')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'kitchen'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Kitchen
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
                <option value="under-50">Under £50</option>
                <option value="50-150">£50 - £150</option>
                <option value="over-150">Over £150</option>
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
            Showing {sortedProducts.length} of {products.length} smart home products
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading smart home products...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        : 'bg-blue-500 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">{getCategoryIcon(product.category)}</span>
                    </div>
                  </div>
                  
                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-base text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Key Specs */}
                  <div className="mb-3 text-xs text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">Connectivity:</span> {product.specs.connectivity}
                    </div>
                    <div>
                      <span className="font-medium">Features:</span> {product.specs.features}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      £{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        £{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Offer Text */}
                  {product.hasOffer && product.offerText && (
                    <p className="text-xs text-orange-600 mb-3 font-medium">
                      {product.offerText}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center">
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                    <Link
                      href={`/uk/store/smart-home/${product.id}`}
                      className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
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