'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon, StarIcon, ShoppingCartIcon, HeartIcon, GiftIcon } from '@heroicons/react/24/outline'
import Navbar from '@/components/Navbar'
import ClosableBanner from '@/components/ClosableBanner'
import DynamicSpacer from '@/components/DynamicSpacer'
import '@/styles/navbar.css'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  isNew?: boolean
  hasOffer?: boolean
  offerText?: string
  badge?: string
}

interface Category {
  id: string
  name: string
  image: string
  href: string
  description: string
}

export default function UKStorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 产品分类
  const categories: Category[] = [
    {
      id: 'smartphones',
      name: 'Smartphones',
      image: '/images/category-phones.jpg',
      href: '/uk/store/smartphones',
      description: 'Latest flagship phones'
    },
    {
      id: 'tablets',
      name: 'Tablets',
      image: '/images/category-tablets.jpg',
      href: '/uk/store/tablets',
      description: 'Powerful tablets for work and play'
    },
    {
      id: 'wearables',
      name: 'Wearables',
      image: '/images/category-wearables.jpg',
      href: '/uk/store/wearables',
      description: 'Smart watches and fitness bands'
    },
    {
      id: 'smart-home',
      name: 'Smart Home',
      image: '/images/category-smart-home.jpg',
      href: '/uk/store/smart-home',
      description: 'Connected home devices'
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      image: '/images/category-lifestyle.jpg',
      href: '/uk/store/lifestyle',
      description: 'Everyday essentials'
    },
    {
      id: 'poco',
      name: 'POCO',
      image: '/images/category-poco.jpg',
      href: '/uk/store/poco',
      description: 'Performance-focused devices'
    }
  ]

  // 模拟产品数据（基于小米英国官网的产品）
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Xiaomi 15T Pro',
      price: 699,
      originalPrice: 799,
      image: '/images/xiaomi-15t-pro.jpg',
      category: 'smartphones',
      rating: 4.8,
      reviews: 1250,
      isNew: true,
      hasOffer: true,
      offerText: 'Free gift: Xiaomi Pad 7 8GB+128GB/256GB for 256GB/512GB',
      badge: 'Free Gift'
    },
    {
      id: '2',
      name: 'Xiaomi 15T',
      price: 549,
      originalPrice: 649,
      image: '/images/xiaomi-15t.jpg',
      category: 'smartphones',
      rating: 4.7,
      reviews: 890,
      hasOffer: true,
      offerText: 'Free gift: Xiaomi TV F 43 2026 & Xiaomi 120W HyperCharge Combo',
      badge: 'Free Gift'
    },
    {
      id: '3',
      name: 'Xiaomi Watch S4 41mm',
      price: 199,
      originalPrice: 249,
      image: '/images/xiaomi-watch-s4.jpg',
      category: 'wearables',
      rating: 4.6,
      reviews: 567,
      hasOffer: true,
      offerText: 'Get a free Xiaomi Power Bank/ Mi Smart Scale S200',
      badge: 'Free Gift'
    },
    {
      id: '4',
      name: 'Xiaomi OpenWear Stereo Pro',
      price: 149,
      image: '/images/xiaomi-openwear-stereo-pro.jpg',
      category: 'wearables',
      rating: 4.5,
      reviews: 234,
      hasOffer: true,
      offerText: 'Open comfort, pro sound | Exclusive £5 Coupon',
      badge: '£5 Off'
    },
    {
      id: '5',
      name: 'REDMI Pad 2 Pro',
      price: 329,
      originalPrice: 399,
      image: '/images/redmi-pad-2-pro.jpg',
      category: 'tablets',
      rating: 4.4,
      reviews: 445,
      hasOffer: true,
      offerText: 'Free gift: REDMI Smart Pen for 128GB & REDMI Pad 2 Pro Keyboard for 256GB',
      badge: 'Free Gift'
    },
    {
      id: '6',
      name: 'Xiaomi Robot Vacuum H40',
      price: 299,
      image: '/images/xiaomi-robot-vacuum-h40.jpg',
      category: 'smart-home',
      rating: 4.7,
      reviews: 678,
      badge: 'Anti-tangle'
    },
    {
      id: '7',
      name: 'Xiaomi Smart Band 9 Pro',
      price: 79,
      originalPrice: 99,
      image: '/images/xiaomi-smart-band-9-pro.jpg',
      category: 'wearables',
      rating: 4.3,
      reviews: 1123,
      badge: 'Your style, your pace'
    },
    {
      id: '8',
      name: 'POCO C65',
      price: 169,
      originalPrice: 199,
      image: '/images/poco-c65.jpg',
      category: 'poco',
      rating: 4.2,
      reviews: 334,
      hasOffer: true,
      offerText: 'New release offer, £30 off',
      badge: '£30 Off'
    }
  ]

  useEffect(() => {
    // 模拟API调用
    const fetchProducts = async () => {
      setLoading(true)
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProducts(mockProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <DynamicSpacer />
      <ClosableBanner />
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center">
            <span className="text-sm md:text-base font-medium">
              🎉 Special Offer: Free gifts with Xiaomi 15T Pro & 15T purchases | Up to 5% off with Mi Points
            </span>
          </div>
        </div>
      </div>

      {/* Hero Banner - 基于小米官网的设计 */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Xiaomi UK Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Deals & Offers | Phones, Watches & More
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#featured"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="#offers"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Offers Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Offers
            </h2>
            <p className="text-lg text-gray-600">
              Don't miss out on these limited-time deals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Offer 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-200">
              <div className="bg-red-500 text-white px-6 py-3">
                <span className="font-bold text-lg">Free Gift</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Xiaomi 15T Pro
                </h3>
                <p className="text-gray-600 mb-4">
                  Get a free wireless charger worth £49
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">From £699</span>
                  <Link
                    href="/uk/store/smartphones"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Offer 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-200">
              <div className="bg-blue-500 text-white px-6 py-3">
                <span className="font-bold text-lg">Bundle Deal</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Xiaomi 15T
                </h3>
                <p className="text-gray-600 mb-4">
                  Free Mi Band 9 with purchase
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">From £549</span>
                  <Link
                    href="/uk/store/smartphones"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Offer 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-200">
              <div className="bg-orange-500 text-white px-6 py-3">
                <span className="font-bold text-lg">Exclusive Coupons</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Exclusive Coupons
                </h3>
                <p className="text-gray-600 mb-4">
                  Up to 25% off on selected items
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">Save More</span>
                  <Link
                    href="/uk/store/coupons"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    View Coupons
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Offers Banner */}
      <section className="bg-gradient-to-r from-yellow-400 to-orange-400 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center">
            <GiftIcon className="h-6 w-6 text-white mr-2" />
            <p className="text-white font-semibold">
              Up to 5% off with Mi Points | 200 Mi Points for Signing Up | 100 Mi Points = £1 OFF
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover our complete range of products</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Latest devices with exclusive offers</p>
            </div>
            
            {/* Category Filter */}
            <div className="hidden md:flex space-x-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-lg text-gray-600">Loading products...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
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
                  <div className="relative aspect-square bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">📱</span>
                      </div>
                    </div>
                    
                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
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
                        {product.rating} ({product.reviews})
                      </span>
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

                    {/* Add to Cart Button */}
                    <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center">
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Offers Section */}
      <section id="offers" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-lg text-gray-600">Limited time deals you don't want to miss</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Student Discount */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">UK Students</h3>
              <p className="text-lg mb-6">Unlock Xiaomi deals with student discount!</p>
              <Link
                href="/student-discount"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Learn More
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>

            {/* Business Discount */}
            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Business</h3>
              <p className="text-lg mb-6">Power your business with Xiaomi UK!</p>
              <Link
                href="/business"
                className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>

            {/* App Download Offer */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">App Exclusive</h3>
              <p className="text-lg mb-6">£15 Voucher on Xiaomi App Download</p>
              <Link
                href="/app-download"
                className="inline-flex items-center bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Download Now
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mi Points & Rewards Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Mi Points Rewards
                </h2>
                <p className="text-xl mb-6 text-orange-100">
                  Earn points with every purchase and get up to 5% off your next order
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span>Earn 1 point for every £1 spent</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">💰</span>
                    <span>Redeem points for discounts on future purchases</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">🎁</span>
                    <span>Exclusive member-only offers and early access</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/support/mi-points"
                    className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                  >
                    Learn More
                  </Link>
                  <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                    Join Now
                  </button>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-2xl p-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold mb-2">Your Points Balance</h3>
                  <div className="text-4xl font-bold mb-4">0 Points</div>
                  <p className="text-orange-100">Sign in to view your balance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get the latest news, product launches, and exclusive offers
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                By subscribing, you agree to our Privacy Policy and Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Support Section */}
            <div>
              <h5 className="text-lg font-semibold mb-6 text-white">SUPPORT</h5>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/support/mi-points" className="hover:text-white transition-colors">Mi Points FAQ</Link></li>
                <li><Link href="/support/shipping" className="hover:text-white transition-colors">Shipping FAQ</Link></li>
                <li><Link href="/support/product" className="hover:text-white transition-colors">Product FAQ</Link></li>
                <li><Link href="/support/trade-in" className="hover:text-white transition-colors">Trade-in</Link></li>
                <li><Link href="/support/coupon" className="hover:text-white transition-colors">Coupon Code</Link></li>
                <li><Link href="/support/exclusive" className="hover:text-white transition-colors">Exclusive Services</Link></li>
                <li><Link href="/support/imei" className="hover:text-white transition-colors">IMEI Redemption</Link></li>
                <li><Link href="/support/student" className="hover:text-white transition-colors">Student Discounts</Link></li>
                <li><Link href="/support/financial" className="hover:text-white transition-colors">Financial Initial Disclosure</Link></li>
                <li><Link href="/support/where-to-buy" className="hover:text-white transition-colors">Where to Buy</Link></li>
                <li><Link href="/support/security" className="hover:text-white transition-colors">Product Security and Telecommunications infrastructure</Link></li>
                <li><Link href="/support/manuals" className="hover:text-white transition-colors">Product User Manuals</Link></li>
              </ul>
            </div>

            {/* Terms and Conditions Section */}
            <div>
              <h5 className="text-lg font-semibold mb-6 text-white">TERMS AND CONDITIONS</h5>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/terms/tc" className="hover:text-white transition-colors">T&C</Link></li>
                <li><Link href="/terms/financing" className="hover:text-white transition-colors">Financing Complaints</Link></li>
                <li><Link href="/terms/uk-declaration" className="hover:text-white transition-colors">UK Declaration of Conformity</Link></li>
                <li><Link href="/terms/scooter-safety" className="hover:text-white transition-colors">Scooter Safety Notice</Link></li>
                <li><Link href="/terms/google-benefits" className="hover:text-white transition-colors">T&C of Google One Benefits</Link></li>
              </ul>
            </div>

            {/* Shop and Learn Section */}
            <div>
              <h5 className="text-lg font-semibold mb-6 text-white">SHOP AND LEARN</h5>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/uk/store" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/uk/store/xiaomi-series" className="hover:text-white transition-colors">Xiaomi Series</Link></li>
                <li><Link href="/uk/store/redmi-series" className="hover:text-white transition-colors">Redmi Series</Link></li>
                <li><Link href="/uk/store/poco" className="hover:text-white transition-colors">POCO</Link></li>
                <li><Link href="/uk/store/smart-home" className="hover:text-white transition-colors">Smart Home</Link></li>
                <li><Link href="/uk/store/lifestyle" className="hover:text-white transition-colors">Lifestyle</Link></li>
                <li><Link href="/business" className="hover:text-white transition-colors">Xiaomi for Business</Link></li>
                <li><Link href="/hyperos" className="hover:text-white transition-colors">HyperOS</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">Xiaomi News</Link></li>
                <li><Link href="/coupons" className="hover:text-white transition-colors">New User Coupons</Link></li>
                <li><Link href="/student-discounts" className="hover:text-white transition-colors">Student Discounts</Link></li>
              </ul>
            </div>

            {/* About Us and Newsletter Section */}
            <div>
              <h5 className="text-lg font-semibold mb-6 text-white">ABOUT US</h5>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li><Link href="/about/xiaomi" className="hover:text-white transition-colors">Xiaomi</Link></li>
                <li><Link href="/about/leadership" className="hover:text-white transition-colors">Leadership Team</Link></li>
                <li><Link href="/about/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/about/integrity" className="hover:text-white transition-colors">Integrity & Compliance</Link></li>
                <li><Link href="/about/accessibility" className="hover:text-white transition-colors">Xiaomi Accessibility</Link></li>
                <li><Link href="/about/trust" className="hover:text-white transition-colors">Trust Centre</Link></li>
              </ul>

              {/* Follow Xiaomi */}
              <div className="mb-8">
                <h6 className="text-base font-semibold mb-4 text-white">Follow Xiaomi</h6>
                <div className="flex space-x-4">
                  <Link href="https://facebook.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Link>
                  <Link href="https://twitter.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </Link>
                  <Link href="https://instagram.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.876.875 1.366 2.026 1.366 3.323s-.49 2.448-1.366 3.323c-.875.807-2.026 1.218-3.323 1.218zm7.718-9.092c-.876 0-1.635-.759-1.635-1.635s.759-1.635 1.635-1.635 1.635.759 1.635 1.635-.759 1.635-1.635 1.635zm0 0"/>
                    </svg>
                  </Link>
                  <Link href="https://tiktok.com/@xiaomi" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h6 className="text-base font-semibold mb-4 text-white">Enter your email address to subscribe to our newsletters</h6>
                <div className="flex gap-2 mb-6">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm"
                  />
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* App Download */}
                <div className="border border-gray-600 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h6 className="text-white font-semibold text-sm">Get the Xiaomi Store App</h6>
                      <p className="text-gray-400 text-xs">Scan for up-to-date info and a better shopping experience</p>
                    </div>
                  </div>
                </div>

                {/* Google Play Download */}
                <Link href="https://play.google.com/store/apps/details?id=com.xiaomi.shop" className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Download on Google Play
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <p>Copyright © 2010 - 2025 Xiaomi. All Rights Reserved</p>
                <Link href="/cookie-settings" className="hover:text-white transition-colors">Cookie settings</Link>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
                <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>United Kingdom / English</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}