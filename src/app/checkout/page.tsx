'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCardIcon, TruckIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

interface Coupon {
  id: string
  name: string
  discount: number
  minAmount: number
  type: 'fixed' | 'percent'
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('alipay')
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 模拟获取购物车数据
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        name: '小米智能台灯Pro',
        price: 199,
        quantity: 1,
        image: '💡'
      },
      {
        id: '2',
        name: '华为智能音箱',
        price: 299,
        quantity: 2,
        image: '🔊'
      }
    ]
    setCartItems(mockCartItems)

    // 模拟获取收货地址
    const mockAddresses: Address[] = [
      {
        id: '1',
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '三里屯街道1号院2号楼3单元401室',
        isDefault: true
      },
      {
        id: '2',
        name: '李四',
        phone: '13900139000',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        detail: '陆家嘴金融区世纪大道100号',
        isDefault: false
      }
    ]
    setAddresses(mockAddresses)
    setSelectedAddress(mockAddresses.find(addr => addr.isDefault)?.id || '')

    // 模拟获取可用优惠券
    const mockCoupons: Coupon[] = [
      {
        id: '1',
        name: '满500减50优惠券',
        discount: 50,
        minAmount: 500,
        type: 'fixed'
      },
      {
        id: '2',
        name: '新用户9折优惠券',
        discount: 10,
        minAmount: 100,
        type: 'percent'
      }
    ]
    setCoupons(mockCoupons)
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal >= 299 ? 0 : 15
  
  const selectedCouponData = coupons.find(c => c.id === selectedCoupon)
  let discount = 0
  if (selectedCouponData && subtotal >= selectedCouponData.minAmount) {
    if (selectedCouponData.type === 'fixed') {
      discount = selectedCouponData.discount
    } else {
      discount = subtotal * (selectedCouponData.discount / 100)
    }
  }
  
  const total = subtotal + shippingFee - discount

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      alert('请选择收货地址')
      return
    }

    setLoading(true)
    
    // 模拟提交订单
    setTimeout(() => {
      alert('订单提交成功！')
      setLoading(false)
      // 实际应用中应该跳转到订单详情页或支付页面
    }, 2000)
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
              <Link href="/uk/store" className="text-gray-700 hover:text-gray-900">
                继续购物
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                购物车
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">确认订单</h1>
          <p className="text-gray-600 mt-2">请确认您的订单信息</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 收货地址 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">收货地址</h2>
              </div>
              
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedAddress === address.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-medium text-gray-900">{address.name}</span>
                          <span className="ml-3 text-gray-600">{address.phone}</span>
                          {address.isDefault && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              默认
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {address.province} {address.city} {address.district} {address.detail}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                + 添加新地址
              </button>
            </div>

            {/* 商品信息 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">商品信息</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">数量: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">¥{item.price}</p>
                      <p className="text-sm text-gray-600">小计: ¥{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 优惠券 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <TicketIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">优惠券</h2>
              </div>
              
              <div className="space-y-3">
                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedCoupon === ''
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCoupon('')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">不使用优惠券</span>
                    <input
                      type="radio"
                      name="coupon"
                      checked={selectedCoupon === ''}
                      onChange={() => setSelectedCoupon('')}
                    />
                  </div>
                </div>
                
                {coupons.map((coupon) => {
                  const canUse = subtotal >= coupon.minAmount
                  return (
                    <div
                      key={coupon.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        !canUse
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : selectedCoupon === coupon.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => canUse && setSelectedCoupon(coupon.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`font-medium ${canUse ? 'text-gray-900' : 'text-gray-400'}`}>
                            {coupon.name}
                          </span>
                          <p className={`text-sm ${canUse ? 'text-gray-600' : 'text-gray-400'}`}>
                            满¥{coupon.minAmount}可用
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="coupon"
                          checked={selectedCoupon === coupon.id}
                          onChange={() => canUse && setSelectedCoupon(coupon.id)}
                          disabled={!canUse}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 支付方式 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">支付方式</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'alipay', name: '支付宝', icon: '💰' },
                  { id: 'wechat', name: '微信支付', icon: '💚' },
                  { id: 'stripe', name: '信用卡支付', icon: '💳' }
                ].map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <span className="font-medium text-gray-900">{method.name}</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 备注 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">订单备注</h2>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="如有特殊要求，请在此填写..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* 右侧订单摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">订单摘要</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品小计</span>
                  <span className="text-gray-900">¥{subtotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">运费</span>
                  <span className="text-gray-900">
                    {shippingFee === 0 ? '免运费' : `¥${shippingFee}`}
                  </span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>优惠券优惠</span>
                    <span>-¥{discount}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">总计</span>
                    <span className="text-xl font-bold text-red-600">¥{total}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSubmitOrder}
                disabled={loading || !selectedAddress}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '提交中...' : '提交订单'}
              </button>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <TruckIcon className="h-4 w-4 mr-1" />
                <span>预计3-5个工作日送达</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}