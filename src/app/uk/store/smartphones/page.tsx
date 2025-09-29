'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ClosableBanner from '@/components/ClosableBanner'
import DynamicSpacer from '@/components/DynamicSpacer'
import '@/styles/navbar.css'
import { ChevronLeftIcon, StarIcon, ShoppingCartIcon, HeartIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import NoticeModal from '@/components/NoticeModal'

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
  specs: {
    display: string
    camera: string
    battery: string
    storage: string
  }
}

export default function SmartphonesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState('all')
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalDesc, setModalDesc] = useState<string>('')
  const smartphones: Product[] = [
    {
      id: '1',
      name: 'Xiaomi 15T Pro',
      price: 699,
      originalPrice: 799,
      image: '/images/xiaomi-15t-pro.jpg',
      rating: 4.8,
      reviews: 1250,
      isNew: true,
      hasOffer: true,
      offerText: 'Free gift: Xiaomi Pad 7 8GB+128GB/256GB for 256GB/512GB',
      badge: 'Free Gift',
      specs: {
        display: '6.67" AMOLED',
        camera: '108MP Triple',
        battery: '5000mAh',
        storage: '256GB/512GB'
      }
    },
    {
      id: '2',
      name: 'Xiaomi 15T',
      price: 549,
      originalPrice: 649,
      image: '/images/xiaomi-15t.jpg',
      rating: 4.7,
      reviews: 890,
      hasOffer: true,
      offerText: 'Free gift: Xiaomi TV F 43 2026 & Xiaomi 120W HyperCharge Combo',
      badge: 'Free Gift',
      specs: {
        display: '6.67" AMOLED',
        camera: '64MP Triple',
        battery: '4800mAh',
        storage: '128GB/256GB'
      }
    },
    {
      id: '3',
      name: 'Redmi Note 14 Pro 5G',
      price: 349,
      originalPrice: 399,
      image: '/images/redmi-note-14-pro.jpg',
      rating: 4.5,
      reviews: 567,
      badge: 'Sand Gold',
      specs: {
        display: '6.67" AMOLED',
        camera: '50MP Triple',
        battery: '5000mAh',
        storage: '128GB/256GB'
      }
    },
    {
      id: '4',
      name: 'Redmi Note 14',
      price: 249,
      originalPrice: 299,
      image: '/images/redmi-note-14.jpg',
      rating: 4.3,
      reviews: 445,
      specs: {
        display: '6.67" IPS',
        camera: '48MP Dual',
        battery: '5000mAh',
        storage: '128GB'
      }
    },
    {
      id: '5',
      name: 'POCO X5 5G',
      price: 319,
      image: '/images/poco-x5-5g.jpg',
      rating: 4.4,
      reviews: 678,
      specs: {
        display: '6.67" AMOLED',
        camera: '48MP Triple',
        battery: '5000mAh',
        storage: '128GB/256GB'
      }
    },
    {
      id: '6',
      name: 'POCO C65',
      price: 169,
      originalPrice: 199,
      image: '/images/poco-c65.jpg',
      rating: 4.2,
      reviews: 334,
      hasOffer: true,
      offerText: 'New release offer, £30 off',
      badge: '£30 Off',
      specs: {
        display: '6.74" IPS',
        camera: '50MP Dual',
        battery: '5000mAh',
        storage: '128GB'
      }
    }
  ]

  useEffect(() => {
    fetch('/api/auth/verify', { credentials: 'include' })
      .then(res => setIsAuthenticated(res.status === 200))
      .catch(() => setIsAuthenticated(false))
  }, [])
  const fetchProducts = async () => {
    try {
      setLoading(true)
      // 先获取分类列表，找到智能手机分类ID（若不存在则回退到全部）
      const catRes = await fetch('/api/categories', { cache: 'no-store' })
      const cats = await catRes.json()
      const target = Array.isArray(cats)
        ? cats.find((c: any) => (c.name || '').toLowerCase() === 'smartphones')
        : null
      const url = target
        ? `/api/products?limit=100&category=${encodeURIComponent(target.id)}`
        : '/api/products?limit=100'

      const res = await fetch(url, { cache: 'no-store' })
      const json = await res.json()
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
          specs: {
            display: '',
            camera: '',
            battery: '',
            storage: ''
          }
        } as Product
      })
      setProducts(apiProducts)
    } catch (e) {
      console.error('Failed to load smartphones:', e)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  fetchProducts()
  const filteredProducts = products.filter(product => {
    if (priceRange === 'all') return true
    if (priceRange === 'under-300' && product.price < 300) return true
    if (priceRange === '300-500' && product.price >= 300 && product.price < 500) return true
    if (priceRange === 'over-500' && product.price >= 500) return true
    return false
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

  const handleAddToCart = async (productId: string) => {
    try {
      if (!isAuthenticated) {
        setModalTitle('Sign in required')
        setModalDesc('Please sign in to add items to your cart.')
        setModalOpen(true)
        return
      }
      setAddingProductId(productId)
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
        credentials: 'include'
      })
      if (res.status === 401) {
        setModalTitle('Session expired')
        setModalDesc('Please sign in again to continue shopping.')
        setModalOpen(true)
        return
      }
      const json = await res.json()
      if (json?.success) {
        setModalTitle('Added to cart')
        setModalDesc('The item has been added to your cart.')
        setModalOpen(true)
      } else {
        setModalTitle('Add to cart failed')
        setModalDesc(json?.error || 'Unable to add the item to your cart. Please try again later.')
        setModalOpen(true)
      }
    } catch (e) {
      console.error('Failed to add to cart:', e)
      setModalTitle('Add to cart failed')
      setModalDesc('A network error occurred. Please try again later.')
      setModalOpen(true)
    } finally {
      setAddingProductId(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <NoticeModal
        isOpen={modalOpen}
        title={modalTitle}
        description={modalDesc}
        onClose={() => setModalOpen(false)}
        primaryAction={!isAuthenticated ? { label: 'Sign in', onClick: () => { setModalOpen(false); window.location.href = '/login' } } : undefined}
        secondaryAction={!isAuthenticated ? { label: 'Continue browsing', onClick: () => setModalOpen(false) } : undefined}
      />
      <ClosableBanner className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-sm text-yellow-800">
          📢 Notice: Smartphone prices and inventory are based on backend data
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
            <span className="text-gray-900 font-medium">Smartphones</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Smartphones</h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover our latest flagship phones with cutting-edge technology
            </p>
            <div className="flex justify-center">
              <div className="bg-orange-600 px-6 py-2 rounded-full">
                <span className="font-semibold">Up to 5% off with Mi Points</span>
              </div>
            </div>
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
                <option value="under-300">Under £300</option>
                <option value="300-500">£300 - £500</option>
                <option value="over-500">Over £500</option>
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
            Showing {sortedProducts.length} of {products.length} smartphones
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading smartphones...</span>
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
                        : 'bg-gray-900 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-6xl">📱</span>
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
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Display:</span> {product.specs.display}
                    </div>
                    <div>
                      <span className="font-medium">Camera:</span> {product.specs.camera}
                    </div>
                    <div>
                      <span className="font-medium">Battery:</span> {product.specs.battery}
                    </div>
                    <div>
                      <span className="font-medium">Storage:</span> {product.specs.storage}
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
                    <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center" onClick={() => handleAddToCart(product.id)} disabled={addingProductId === product.id}>
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      {addingProductId === product.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <Link
                      href={`/uk/store/smartphones/${product.id}`}
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