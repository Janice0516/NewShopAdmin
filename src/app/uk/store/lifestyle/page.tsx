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
  category: 'bags' | 'accessories' | 'travel' | 'outdoor' | 'wellness'
  specs: {
    material: string
    dimensions: string
    weight: string
    features: string
  }
}

export default function LifestylePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalDesc, setModalDesc] = useState('')

  const lifestyleProducts: Product[] = [
    {
      id: '1',
      name: 'Xiaomi Travel Backpack 2',
      price: 49,
      originalPrice: 59,
      image: '/images/xiaomi-travel-backpack-2.jpg',
      rating: 4.5,
      reviews: 892,
      category: 'bags',
      hasOffer: true,
      offerText: 'Free laptop sleeve included',
      badge: 'Bundle',
      specs: {
        material: 'Water-resistant fabric',
        dimensions: '45 x 32 x 18 cm',
        weight: '1.2kg',
        features: '26L capacity, USB charging port'
      }
    },
    {
      id: '2',
      name: 'Mi Portable Electric Scooter 4',
      price: 399,
      originalPrice: 449,
      image: '/images/mi-scooter-4.jpg',
      rating: 4.7,
      reviews: 1567,
      isNew: true,
      category: 'travel',
      badge: 'New',
      specs: {
        material: 'Aluminum alloy frame',
        dimensions: '108 x 43 x 114 cm',
        weight: '14.2kg',
        features: '30km range, App connectivity'
      }
    },
    {
      id: '3',
      name: 'Xiaomi Mijia Desk Lamp Pro',
      price: 79,
      originalPrice: 99,
      image: '/images/xiaomi-desk-lamp-pro.jpg',
      rating: 4.6,
      reviews: 678,
      category: 'accessories',
      badge: 'Pro',
      specs: {
        material: 'Aluminum + ABS',
        dimensions: '60 x 20 x 8 cm',
        weight: '1.8kg',
        features: 'Eye protection, App control, Timer'
      }
    },
    {
      id: '4',
      name: 'Mi Outdoor Bluetooth Speaker',
      price: 39,
      originalPrice: 49,
      image: '/images/mi-outdoor-speaker.jpg',
      rating: 4.4,
      reviews: 1234,
      category: 'outdoor',
      hasOffer: true,
      offerText: 'Waterproof rating IPX7',
      badge: 'Waterproof',
      specs: {
        material: 'Silicone + Metal mesh',
        dimensions: '9.5 x 9.5 x 4 cm',
        weight: '0.3kg',
        features: '16h battery, IPX7, Hands-free calls'
      }
    },
    {
      id: '5',
      name: 'Xiaomi Mi Body Composition Scale 2',
      price: 29,
      originalPrice: 39,
      image: '/images/xiaomi-body-scale-2.jpg',
      rating: 4.3,
      reviews: 2145,
      category: 'wellness',
      badge: 'Health',
      specs: {
        material: 'Tempered glass + ABS',
        dimensions: '30 x 30 x 2.5 cm',
        weight: '1.7kg',
        features: '13 body metrics, App sync, Multi-user'
      }
    },
    {
      id: '6',
      name: 'Mi Casual Daypack',
      price: 25,
      originalPrice: 35,
      image: '/images/mi-casual-daypack.jpg',
      rating: 4.2,
      reviews: 567,
      category: 'bags',
      specs: {
        material: 'Polyester fabric',
        dimensions: '42 x 30 x 13 cm',
        weight: '0.5kg',
        features: '13.3" laptop compartment, Water-resistant'
      }
    },
    {
      id: '7',
      name: 'Xiaomi Portable Photo Printer',
      price: 89,
      originalPrice: 109,
      image: '/images/xiaomi-photo-printer.jpg',
      rating: 4.5,
      reviews: 445,
      isNew: true,
      category: 'accessories',
      badge: 'New',
      specs: {
        material: 'ABS plastic',
        dimensions: '12 x 8.5 x 4 cm',
        weight: '0.5kg',
        features: 'Bluetooth, AR photos, 2x3 inch prints'
      }
    },
    {
      id: '8',
      name: 'Mi Camping Lantern',
      price: 19,
      originalPrice: 25,
      image: '/images/mi-camping-lantern.jpg',
      rating: 4.1,
      reviews: 334,
      category: 'outdoor',
      hasOffer: true,
      offerText: 'Perfect for camping season',
      badge: 'Outdoor',
      specs: {
        material: 'ABS + Silicone',
        dimensions: '8.5 x 8.5 x 12 cm',
        weight: '0.4kg',
        features: '350 lumens, 90h runtime, USB-C charging'
      }
    },
    {
      id: '9',
      name: 'Xiaomi Air Purifier 4 Compact',
      price: 149,
      originalPrice: 179,
      image: '/images/xiaomi-air-purifier-4.jpg',
      rating: 4.6,
      reviews: 789,
      category: 'wellness',
      badge: 'Compact',
      specs: {
        material: 'ABS + HEPA filter',
        dimensions: '24 x 24 x 52 cm',
        weight: '5.6kg',
        features: 'HEPA H13, App control, 31m² coverage'
      }
    }
  ]

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const catRes = await fetch('/api/categories', { cache: 'no-store' })
        const cats = await catRes.json()
        const matchNames = ['生活用品', 'Life Style', 'Lifestyle', 'Home Goods']
        const target = Array.isArray(cats)
          ? (cats.find((c: any) => c.code === 'life_style') ||
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
          category: 'accessories' as const,
          specs: { material: '', dimensions: '', weight: '', features: '' }
        })) as Product[]
        setProducts(apiProducts)
      } catch (e) {
        console.error('Failed to load lifestyle:', e)
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
    if (priceRange === 'under-50' && product.price >= 50) priceMatch = false
    if (priceRange === '50-100' && (product.price < 50 || product.price >= 100)) priceMatch = false
    if (priceRange === 'over-100' && product.price < 100) priceMatch = false
    
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
      case 'bags':
        return '🎒'
      case 'accessories':
        return '💡'
      case 'travel':
        return '🛴'
      case 'outdoor':
        return '🏕️'
      case 'wellness':
        return '🏃‍♂️'
      default:
        return '🎯'
    }
  }

  useEffect(() => {
    fetch('/api/auth/verify', { credentials: 'include' })
      .then(res => setIsAuthenticated(res.status === 200))
      .catch(() => setIsAuthenticated(false))
  }, [])

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
      <ClosableBanner className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-sm text-yellow-800">
          🛍️ Notice: Lifestyle products are based on backend listings
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
            <span className="text-gray-900 font-medium">Lifestyle</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Lifestyle</h1>
            <p className="text-xl text-indigo-200 mb-8">
              Enhance your daily life with innovative products designed for modern living
            </p>
            <div className="flex justify-center">
              <div className="bg-orange-600 px-6 py-2 rounded-full">
                <span className="font-semibold">Quality meets innovation</span>
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
              onClick={() => setCategoryFilter('bags')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'bags'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Bags & Backpacks
            </button>
            <button
              onClick={() => setCategoryFilter('accessories')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'accessories'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Accessories
            </button>
            <button
              onClick={() => setCategoryFilter('travel')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'travel'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Travel & Mobility
            </button>
            <button
              onClick={() => setCategoryFilter('outdoor')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'outdoor'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Outdoor
            </button>
            <button
              onClick={() => setCategoryFilter('wellness')}
              className={`pb-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                categoryFilter === 'wellness'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Health & Wellness
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
                <option value="50-100">£50 - £100</option>
                <option value="over-100">Over £100</option>
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
            Showing {sortedProducts.length} of {products.length} lifestyle products
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading lifestyle products...</span>
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
                        : 'bg-indigo-500 text-white'
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
                      <span className="font-medium">Material:</span> {product.specs.material}
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
                    <button className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center" onClick={() => handleAddToCart(product.id)} disabled={addingProductId === product.id}>
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      {addingProductId === product.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <Link
                      href={`/uk/store/lifestyle/${product.id}`}
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
      <NoticeModal
        isOpen={modalOpen}
        title={modalTitle}
        description={modalDesc}
        onClose={() => setModalOpen(false)}
        primaryAction={!isAuthenticated ? { label: 'Sign in', onClick: () => { setModalOpen(false); window.location.href = '/login' } } : undefined}
        secondaryAction={!isAuthenticated ? { label: 'Continue browsing', onClick: () => setModalOpen(false) } : undefined}
      />
    </div>
  )
}