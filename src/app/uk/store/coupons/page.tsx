'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ClosableBanner from '@/components/ClosableBanner'
import DynamicSpacer from '@/components/DynamicSpacer'
import '@/styles/navbar.css'
import CouponCard from '@/components/CouponCard'

const coupons = [
  {
    id: '1',
    title: 'Welcome Offer',
    description: 'New customer exclusive discount',
    discount: '10%',
    code: 'WELCOME10',
    expiryDate: '31 Dec 2024',
    minPurchase: '£50',
    category: 'All Products'
  },
  {
    id: '2',
    title: 'Smartphone Special',
    description: 'Save on latest smartphones',
    discount: '£50',
    code: 'PHONE50',
    expiryDate: '15 Jan 2025',
    minPurchase: '£300',
    category: 'Smartphones'
  },
  {
    id: '3',
    title: 'Student Discount',
    description: 'Verified student exclusive',
    discount: '15%',
    code: 'STUDENT15',
    expiryDate: '30 Jun 2025',
    minPurchase: '£100',
    category: 'All Products'
  },
  {
    id: '4',
    title: 'Smart Home Bundle',
    description: 'Buy 2 or more smart home products',
    discount: '20%',
    code: 'SMARTHOME20',
    expiryDate: '28 Feb 2025',
    minPurchase: '£200',
    category: 'Smart Home'
  },
  {
    id: '5',
    title: 'Free Shipping',
    description: 'No minimum purchase required',
    discount: 'FREE',
    code: 'FREESHIP',
    expiryDate: '31 Mar 2025',
    category: 'Shipping'
  },
  {
    id: '6',
    title: 'Wearables Week',
    description: 'Special offer on watches & bands',
    discount: '25%',
    code: 'WEARABLE25',
    expiryDate: '07 Feb 2025',
    minPurchase: '£150',
    category: 'Wearables'
  }
]

const categories = ['All Products', 'Smartphones', 'Wearables', 'Smart Home', 'Shipping']

export default function CouponsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products')

  const filteredCoupons = selectedCategory === 'All Products' 
    ? coupons 
    : coupons.filter(coupon => coupon.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <ClosableBanner />
      <Navbar />
      <DynamicSpacer />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coupons & Offers</h1>
              <p className="text-gray-600 mt-2">Save more with exclusive discount codes</p>
            </div>
            <Link
              href="/uk/store"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No coupons available
            </h3>
            <p className="text-gray-600">
              Check back later for new offers in this category
            </p>
          </div>
        )}
      </div>

      {/* How to Use Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How to Use Coupons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Copy Code</h3>
              <p className="text-gray-600">
                Click the "Copy" button on any coupon card to copy the discount code
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Shop Products</h3>
              <p className="text-gray-600">
                Add eligible products to your cart and proceed to checkout
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Apply & Save</h3>
              <p className="text-gray-600">
                Paste the code at checkout and enjoy your discount
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}