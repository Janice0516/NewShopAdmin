'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, TruckIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

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

interface TrackingModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  orderNo: string
}

export default function TrackingModal({ isOpen, onClose, orderId, orderNo }: TrackingModalProps) {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // 添加跟踪记录表单
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRecord, setNewRecord] = useState({
    status: '',
    description: '',
    location: ''
  })

  useEffect(() => {
    if (isOpen && orderId) {
      fetchTrackingData()
    }
  }, [isOpen, orderId])

  const fetchTrackingData = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/orders/${orderId}/tracking`)
      const result = await response.json()
      
      if (result.success) {
        setTrackingData(result.data)
      } else {
        setError(result.error || '获取物流信息失败')
      }
    } catch (error) {
      console.error('获取物流信息失败:', error)
      setError('获取物流信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAddRecord = async () => {
    if (!newRecord.status || !newRecord.description) {
      alert('Please fill in status and description')
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecord)
      })

      const result = await response.json()
      if (result.success) {
        setNewRecord({ status: '', description: '', location: '' })
        setShowAddForm(false)
        fetchTrackingData() // 重新获取数据
      } else {
        alert(result.error || 'Failed to add record')
      }
    } catch (error) {
      console.error('添加跟踪记录失败:', error)
      alert('Failed to add record')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SHIPPED':
        return 'text-blue-600 bg-blue-100'
      case 'DELIVERED':
        return 'text-green-600 bg-green-100'
      case 'IN_TRANSIT':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">物流跟踪</h2>
            <p className="text-sm text-gray-500">订单号: {orderNo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">加载中...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchTrackingData}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                重试
              </button>
            </div>
          ) : trackingData ? (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">基本信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">物流单号:</span>
                    <p className="font-medium">{trackingData.order.trackingNumber || '暂无'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">物流公司:</span>
                    <p className="font-medium">{trackingData.order.shippingCompany || '暂无'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">发货时间:</span>
                    <p className="font-medium">
                      {trackingData.order.shippedAt ? formatDateTime(trackingData.order.shippedAt) : '暂无'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">预计送达:</span>
                    <p className="font-medium">
                      {trackingData.order.estimatedDelivery ? formatDateTime(trackingData.order.estimatedDelivery) : '暂无'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 物流跟踪历史 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">物流跟踪</h3>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    添加记录
                  </button>
                </div>

                {/* 添加记录表单 */}
                {showAddForm && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                        <input
                          type="text"
                          value={newRecord.status}
                          onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          placeholder="如: IN_TRANSIT"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
                        <input
                          type="text"
                          value={newRecord.location}
                          onChange={(e) => setNewRecord({ ...newRecord, location: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          placeholder="如: 北京分拣中心"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={handleAddRecord}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm mr-2"
                        >
                          添加
                        </button>
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 text-sm"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                      <textarea
                        value={newRecord.description}
                        onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        rows={2}
                        placeholder="详细描述..."
                      />
                    </div>
                  </div>
                )}

                {/* 跟踪历史列表 */}
                <div className="space-y-4">
                  {trackingData.trackingHistory.length > 0 ? (
                    trackingData.trackingHistory.map((record, index) => (
                      <div key={record.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(record.status)}`}>
                            {record.status === 'DELIVERED' ? (
                              <MapPinIcon className="h-4 w-4" />
                            ) : (
                              <TruckIcon className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{record.description}</p>
                            <span className="text-xs text-gray-500 flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {formatDateTime(record.timestamp)}
                            </span>
                          </div>
                          {record.location && (
                            <p className="text-sm text-gray-500 mt-1">
                              <MapPinIcon className="h-3 w-3 inline mr-1" />
                              {record.location}
                            </p>
                          )}
                        </div>
                        {index < trackingData.trackingHistory.length - 1 && (
                          <div className="absolute left-4 mt-8 w-px h-8 bg-gray-200"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TruckIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>暂无物流跟踪信息</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}