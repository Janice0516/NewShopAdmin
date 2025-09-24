'use client'

import { useState } from 'react'

interface Coupon {
  id: string
  title: string
  description: string
  discount: string
  code: string
  expiryDate: string
  minPurchase?: string
  category?: string
  isUsed?: boolean
}

interface CouponCardProps {
  coupon: Coupon
}

export default function CouponCard({ coupon }: CouponCardProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-1">{coupon.title}</h3>
            <p className="text-orange-100 text-sm">{coupon.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{coupon.discount}</div>
            <div className="text-xs text-orange-100">OFF</div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          {coupon.minPurchase && (
            <p className="text-sm text-gray-600 mb-2">
              Minimum purchase: {coupon.minPurchase}
            </p>
          )}
          {coupon.category && (
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {coupon.category}
            </span>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Coupon Code:</span>
            <span className="text-xs text-gray-500">Expires: {coupon.expiryDate}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm">
              {coupon.code}
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                isCopied
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}