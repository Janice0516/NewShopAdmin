'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserInfo {
  userId: string
  email: string
  role: string
}

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  total: number
  product?: {
    id: string
    name: string
    images: string[]
    price: number
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

interface Order {
  id: string
  orderNo?: string | null
  status: string
  totalAmount: number
  discountAmount: number
  finalAmount: number
  createdAt: string
  trackingNumber?: string | null
  shippingCompany?: string | null
  address?: AddressInfo | null
  user?: {
    id: string
    name?: string | null
    email?: string | null
  }
  items: OrderItem[]
}

export default function MyOrdersPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        // 验证登录
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

        // 获取订单列表（后端暂未按用户过滤，这里在前端过滤）
        const ordersRes = await fetch('/api/orders?limit=50')
        if (!ordersRes.ok) {
          throw new Error('获取订单列表失败')
        }
        const ordersData = await ordersRes.json()
        const allOrders: Order[] = ordersData.data.orders || []

        const myOrders = allOrders.filter(o => o.user?.id === currentUser.userId)
        setOrders(myOrders)
      } catch (err) {
        console.error(err)
        setError('加载订单失败')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-600">{error}</p>
          <div className="mt-6">
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md">去登录</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">我的订单</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">暂无订单</p>
            <div className="mt-4">
              <Link href="/uk/store" className="px-4 py-2 bg-orange-600 text-white rounded-md">去购物</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">订单号</p>
                    <p className="text-base font-medium text-gray-900">{order.orderNo || order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">下单时间</p>
                    <p className="text-base font-medium text-gray-900">{new Date(order.createdAt).toLocaleString('zh-CN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">订单状态</p>
                    <p className="text-base font-medium text-gray-900">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">应付金额</p>
                    <p className="text-base font-medium text-orange-600">￥{order.finalAmount?.toFixed?.(2) ?? Number(order.finalAmount).toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/orders/${order.id}`} className="px-3 py-1.5 bg-gray-800 text-white rounded-md text-sm">查看详情</Link>
                  {(order.trackingNumber || order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                    <Link href={`/orders/${order.id}/tracking`} className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">查看物流</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}