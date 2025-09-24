'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { TruckIcon, MapPinIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface TrackingHistory {
  id: string
  status: string
  description: string
  location?: string
  timestamp: string
}

interface TrackingData {
  order: {
    id: string
    orderNo: string
    status: string
    trackingNumber?: string
    shippingCompany?: string
    shippedAt?: string
    deliveredAt?: string
    estimatedDelivery?: string
  }
  trackingHistory: TrackingHistory[]
}

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTrackingData()
  }, [orderId])

  const fetchTrackingData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}/tracking`)
      if (!response.ok) {
        throw new Error('获取物流信息失败')
      }
      const data = await response.json()
      setTrackingData(data)
    } catch (error) {
      console.error('获取物流信息失败:', error)
      setError('获取物流信息失败')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SHIPPED':
        return <TruckIcon className="h-5 w-5 text-blue-500" />
      case 'IN_TRANSIT':
        return <TruckIcon className="h-5 w-5 text-yellow-500" />
      case 'DELIVERED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'EXCEPTION':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SHIPPED':
        return '已发货'
      case 'IN_TRANSIT':
        return '运输中'
      case 'OUT_FOR_DELIVERY':
        return '派送中'
      case 'DELIVERED':
        return '已送达'
      case 'EXCEPTION':
        return '异常'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

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

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error || '订单不存在'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">物流跟踪</h1>
          <p className="mt-2 text-gray-600">订单号：{trackingData.order.orderNo}</p>
        </div>

        {/* 基本信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">订单状态</p>
              <p className="text-base font-medium text-gray-900">
                {getStatusText(trackingData.order.status)}
              </p>
            </div>
            {trackingData.order.trackingNumber && (
              <div>
                <p className="text-sm text-gray-500">快递单号</p>
                <p className="text-base font-medium text-gray-900">
                  {trackingData.order.trackingNumber}
                </p>
              </div>
            )}
            {trackingData.order.shippingCompany && (
              <div>
                <p className="text-sm text-gray-500">快递公司</p>
                <p className="text-base font-medium text-gray-900">
                  {trackingData.order.shippingCompany}
                </p>
              </div>
            )}
            {trackingData.order.estimatedDelivery && (
              <div>
                <p className="text-sm text-gray-500">预计送达</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(trackingData.order.estimatedDelivery)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 物流轨迹 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">物流轨迹</h2>
          
          {trackingData.trackingHistory.length === 0 ? (
            <div className="text-center py-8">
              <TruckIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-500">暂无物流信息</p>
            </div>
          ) : (
            <div className="space-y-6">
              {trackingData.trackingHistory.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* 连接线 */}
                  {index < trackingData.trackingHistory.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* 状态图标 */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                      {getStatusIcon(item.status)}
                    </div>
                    
                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {getStatusText(item.status)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                      {item.location && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {item.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 返回按钮 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  )
}