'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  inStock: boolean
}

// 模拟购物车数据
const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: '1',
    name: '小米智能台灯Pro',
    price: 299,
    originalPrice: 399,
    image: '💡',
    quantity: 2,
    inStock: true
  },
  {
    id: '2',
    productId: '2',
    name: '米家智能摄像头',
    price: 199,
    image: '📹',
    quantity: 1,
    inStock: true
  },
  {
    id: '3',
    productId: '4',
    name: '小爱音箱Pro',
    price: 399,
    image: '🔊',
    quantity: 1,
    inStock: false
  }
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
    setSelectedItems(selected => selected.filter(itemId => itemId !== id))
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems(selected =>
      selected.includes(id)
        ? selected.filter(itemId => itemId !== id)
        : [...selected, id]
    )
  }

  const toggleSelectAll = () => {
    const availableItems = cartItems.filter(item => item.inStock)
    if (selectedItems.length === availableItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(availableItems.map(item => item.id))
    }
  }

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id))
  const totalPrice = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalOriginalPrice = selectedCartItems.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price
    return sum + originalPrice * item.quantity
  }, 0)
  const totalSavings = totalOriginalPrice - totalPrice

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('请选择要结算的商品')
      return
    }
    // 这里应该跳转到结算页面
    alert('结算功能开发中')
  }

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
              <Link href="/products" className="text-gray-700 hover:text-gray-900">
                商品
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                登录
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                首页
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <span className="text-gray-900">购物车</span>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">购物车</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">购物车是空的</h2>
            <p className="text-gray-600 mb-8">快去挑选您喜欢的商品吧！</p>
            <Link
              href="/uk/store"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              去购物
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 购物车商品列表 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {/* 全选头部 */}
                <div className="p-4 border-b flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.filter(item => item.inStock).length && cartItems.filter(item => item.inStock).length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">全选</span>
                  </label>
                  <span className="ml-4 text-sm text-gray-500">
                    共 {cartItems.length} 件商品
                  </span>
                </div>

                {/* 商品列表 */}
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* 选择框 */}
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          disabled={!item.inStock}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />

                        {/* 商品图片 */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {item.image}
                        </div>

                        {/* 商品信息 */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/uk/store/${item.productId}`}
                            className="text-lg font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          {!item.inStock && (
                            <p className="text-sm text-red-500 mt-1">商品缺货</p>
                          )}
                        </div>

                        {/* 价格 */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            ¥{item.price}
                          </div>
                          {item.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ¥{item.originalPrice}
                            </div>
                          )}
                        </div>

                        {/* 数量控制 */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={!item.inStock || item.quantity <= 1}
                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={!item.inStock}
                            className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* 小计 */}
                        <div className="text-right w-24">
                          <div className="text-lg font-bold text-gray-900">
                            ¥{item.price * item.quantity}
                          </div>
                        </div>

                        {/* 删除按钮 */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 结算信息 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4">订单摘要</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品件数</span>
                    <span>{selectedCartItems.reduce((sum, item) => sum + item.quantity, 0)} 件</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">商品总价</span>
                    <span>¥{totalOriginalPrice}</span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>优惠金额</span>
                      <span>-¥{totalSavings}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费</span>
                    <span className="text-green-600">免费</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">实付款</span>
                    <span className="text-2xl font-bold text-red-600">¥{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  结算 ({selectedItems.length})
                </button>

                <div className="mt-4 text-center">
                  <Link
                    href="/uk/store"
                    className="text-blue-600 hover:text-blue-500 text-sm"
                  >
                    继续购物
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}