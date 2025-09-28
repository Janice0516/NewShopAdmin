'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface UserInfo {
  userId: string
  email: string
  role: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  total: number
  product?: {
    id: string
    name: string
    images: string[]
    price: number
    description?: string | null
  }
}

interface AddressInfo {
  id: string
  recipientName: string
  phoneNumber: string
  country: string
  city: string
  postalCode: string
  addressLine1: string
  addressLine2?: string | null
}

interface OrderDetail {
  id: string
  orderNo?: string | null
  status: string
  remark?: string | null
  totalAmount: number
  discountAmount: number
  finalAmount: number
  createdAt: string
  trackingNumber?: string | null
  shippingCompany?: string | null
  address?: AddressInfo | null
  items: OrderItem[]
  user?: { id: string; name?: string | null; email?: string | null }
}

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string

  const [user, setUser] = useState<UserInfo | null>(null)
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const verifyRes = await fetch('/api/auth/verify', { credentials: 'include' })
        if (!verifyRes.ok) {
          setError('请先登录')
          setLoading(false)
          return
        }
        const verifyData = await verifyRes.json()
        const currentUser: UserInfo = {
          userId: verifyData.user?.id,
          email: verifyData.user?.email,
          role: verifyData.user?.role,
        }
        if (!currentUser?.userId) {
          setError('请先登录')
          setLoading(false)
          return
        }
        setUser(currentUser)

        const detailRes = await fetch(`/api/orders/${orderId}`)
        if (!detailRes.ok) {
          throw new Error('获取订单详情失败')
        }
        const detailData = await detailRes.json()
        const detail: OrderDetail = detailData.data
        setOrder(detail)
      } catch (err) {
        console.error(err)
        setError('加载订单详情失败')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-2 text-gray-600">{error || '订单不存在'}</p>
          <div className="mt-6">
            <Link href="/orders" className="px-4 py-2 bg-gray-800 text-white rounded-md">返回我的订单</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
            <p className="text-gray-600 mt-1">订单号：{order.orderNo || order.id}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/orders" className="px-3 py-1.5 bg-gray-800 text-white rounded-md text-sm">我的订单</Link>
            {(order.trackingNumber || order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
              <Link href={`/orders/${order.id}/tracking`} className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">查看物流</Link>
            )}
          </div>
        </div>

        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">订单状态</p>
              <p className="text-base font-medium text-gray-900">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">下单时间</p>
              <p className="text-base font-medium text-gray-900">{new Date(order.createdAt).toLocaleString('zh-CN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">应付金额</p>
              <p className="text-base font-medium text-orange-600">￥{Number(order.finalAmount).toFixed(2)}</p>
            </div>
            {order.address && (
              <div>
                <p className="text-sm text-gray-500">收货信息</p>
                <p className="text-base font-medium text-gray-900">
                  {order.address.recipientName}，{order.address.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">
                  {order.address.addressLine1}{order.address.addressLine2 ? `，${order.address.addressLine2}` : ''}，{order.address.city}，{order.address.country}，{order.address.postalCode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 商品列表 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">商品明细</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {/* 可扩展为使用 product.images[0] */}
                  <span className="text-gray-400">IMG</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">{item.product?.name || '商品'}</p>
                  <p className="text-sm text-gray-600">数量：{item.quantity}，单价：￥{Number(item.price).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-medium text-gray-900">￥{Number(item.total).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}