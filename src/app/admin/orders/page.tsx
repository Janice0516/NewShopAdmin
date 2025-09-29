'use client'

import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import TrackingModal from '@/components/admin/TrackingModal'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
    price: number
  }
}

interface Order {
  id: string
  orderNo: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  address: {
    id: string
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    isDefault: boolean
  }
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  finalAmount: number
  shippingFee: number
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  paymentMethod?: string
  paymentId?: string
  remark?: string
  createdAt: string
  updatedAt: string
}

interface OrderStats {
  PENDING: number
  PAID: number
  SHIPPED: number
  DELIVERED: number
  CANCELLED: number
  REFUNDED: number
  totalRevenue: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    PENDING: 0,
    PAID: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
    REFUNDED: 0,
    totalRevenue: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)// 模态框状态
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [trackingOrderId, setTrackingOrderId] = useState('')
  const [trackingOrderNo, setTrackingOrderNo] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [batchStatus, setBatchStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const ordersPerPage = 10

  // 获取订单列表
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ordersPerPage.toString(),
        search: searchTerm,
        status: filterStatus === 'all' ? '' : filterStatus,
        startDate,
        endDate
      })

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data.orders)
        setStats(data.data.stats)
        setTotalPages(Math.ceil(data.data.total / ordersPerPage))
      } else {
        console.error('获取订单失败:', data.error)
      }
    } catch (error) {
      console.error('获取订单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, searchTerm, filterStatus, startDate, endDate])

  // 批量更新订单状态
  const handleBatchUpdate = async () => {
    if (selectedOrders.length === 0 || !batchStatus) {
      alert('Please select orders and status')
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderIds: selectedOrders,
          status: batchStatus
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(`Successfully updated ${data.data.count} order statuses`)
        setSelectedOrders([])
        setShowBatchModal(false)
        setBatchStatus('')
        fetchOrders()
      } else {
        alert('Update failed: ' + data.error)
      }
    } catch (error) {
      console.error('批量更新失败:', error)
      alert('Update failed')
    }
  }

  // 导出订单
  const handleExport = async (format: 'csv' | 'excel') => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        format,
        status: filterStatus === 'all' ? '' : filterStatus,
        startDate,
        endDate
      })

      const response = await fetch(`/api/orders/export?${params}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Export failed')
      }
    } catch (error) {
      console.error('导出失败:', error)
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  // 更新单个订单状态
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Order status updated successfully')
        fetchOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.data)
        }
      } else {
        alert('Update failed: ' + data.error)
      }
    } catch (error) {
      console.error('更新订单状态失败:', error)
      alert('Update failed')
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts = {
      'PENDING': '待付款',
      'PAID': '已付款',
      'SHIPPED': '已发货',
      'DELIVERED': '已送达',
      'CANCELLED': '已取消',
      'REFUNDED': '已退款'
    }
    return texts[status as keyof typeof texts] || status
  }

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  // 查看物流跟踪
  const handleViewTracking = (order: Order) => {
    setTrackingOrderId(order.id)
    setTrackingOrderNo(order.orderNo)
    setShowTrackingModal(true)
  }

  // 单选订单
  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId])
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-600">管理所有订单信息</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {exporting ? '导出中...' : '导出CSV'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={exporting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {exporting ? '导出中...' : '导出Excel'}
          </button>
          {selectedOrders.length > 0 && (
            <button
              onClick={() => setShowBatchModal(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              批量操作 ({selectedOrders.length})
            </button>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总订单</p>
              <p className="text-xl font-bold text-gray-900">
                {Object.values(stats).reduce((sum, val) => typeof val === 'number' && val !== stats.totalRevenue ? sum + val : sum, 0)}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">待付款</p>
              <p className="text-xl font-bold text-yellow-600">{stats.PENDING}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已付款</p>
              <p className="text-xl font-bold text-blue-600">{stats.PAID}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已发货</p>
              <p className="text-xl font-bold text-purple-600">{stats.SHIPPED}</p>
            </div>
            <TruckIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已送达</p>
              <p className="text-xl font-bold text-green-600">{Number.isFinite(Number(stats.totalRevenue)) ? Number(stats.totalRevenue).toFixed(2) : '0.00'}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已取消</p>
              <p className="text-xl font-bold text-red-600">{stats.CANCELLED}</p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总收入</p>
              <p className="text-xl font-bold text-green-600">¥{Number.isFinite(Number(stats.totalRevenue)) ? Number(stats.totalRevenue).toFixed(2) : '0.00'}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索订单号、用户名、邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">订单状态</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">全部状态</option>
              <option value="PENDING">待付款</option>
              <option value="PAID">已付款</option>
              <option value="SHIPPED">已发货</option>
              <option value="DELIVERED">已送达</option>
              <option value="CANCELLED">已取消</option>
              <option value="REFUNDED">已退款</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
                setStartDate('')
                setEndDate('')
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">订单列表</h3>
            <div className="text-sm text-gray-500">
              共 {orders.length} 条记录
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无订单数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.address?.phone || '未设置'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="text-sm text-gray-900 mb-1">
                            {item.product.name} × {item.quantity}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-gray-500">
                            等 {order.items.length} 件商品
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ¥{Number.isFinite(Number(order.finalAmount)) ? Number(order.finalAmount).toFixed(2) : '0.00'}
                        </div>
                        {order.discountAmount > 0 && (
                          <div className="text-sm text-gray-500">
                            优惠: -¥{Number.isFinite(Number(order.discountAmount)) ? Number(order.discountAmount).toFixed(2) : '0.00'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowDetailModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="查看详情"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                        <button
                          onClick={() => handleViewTracking(order)}
                          className="text-purple-600 hover:text-purple-900"
                          title="查看物流"
                        >
                          <TruckIcon className="h-4 w-4" />
                        </button>
                      )}
                      {order.status === 'PAID' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                          className="text-green-600 hover:text-green-900"
                          title="标记为已发货"
                        >
                          <TruckIcon className="h-4 w-4" />
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                          className="text-green-600 hover:text-green-900"
                          title="标记为已送达"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      {(order.status === 'PENDING' || order.status === 'PAID') && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                          className="text-red-600 hover:text-red-900"
                          title="取消订单"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示第 {(currentPage - 1) * ordersPerPage + 1} - {Math.min(currentPage * ordersPerPage, orders.length)} 条，
                共 {orders.length} 条记录
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="px-3 py-1 text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">订单详情</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">订单信息</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">订单号:</span>
                      <span className="font-medium">{selectedOrder.orderNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">下单时间:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">订单状态:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">支付方式:</span>
                      <span>{selectedOrder.paymentMethod || '未设置'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">客户信息</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">姓名:</span>
                      <span>{selectedOrder.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">邮箱:</span>
                      <span>{selectedOrder.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">电话:</span>
                      <span>{selectedOrder.address?.phone || '未设置'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">收货地址</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="font-medium">{selectedOrder.address?.name || '未设置'}</div>
                  <div className="text-gray-600 mt-1">
                    {selectedOrder.address.province} {selectedOrder.address.city} {selectedOrder.address.district}
                  </div>
                  <div className="text-gray-600">{selectedOrder.address?.detail || '未设置'}</div>
                  <div className="text-gray-600 mt-1">{selectedOrder.address?.phone || '未设置'}</div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">商品清单</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">单价</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">小计</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {item.product.images && item.product.images[0] && (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ¥{item.price ? item.price.toFixed(2) : '0.00'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ¥{(item.price && item.quantity) ? (item.price * item.quantity).toFixed(2) : '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">费用明细</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品总额:</span>
                    <span>¥{selectedOrder.totalAmount ? selectedOrder.totalAmount.toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">运费:</span>
                    <span>¥{selectedOrder.shippingFee ? selectedOrder.shippingFee.toFixed(2) : '0.00'}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>优惠金额:</span>
                      <span>-¥{selectedOrder.discountAmount ? selectedOrder.discountAmount.toFixed(2) : '0.00'}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                    <span>实付金额:</span>
                    <span className="text-lg">¥{Number.isFinite(Number(selectedOrder.finalAmount)) ? Number(selectedOrder.finalAmount).toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedOrder.remark && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">备注信息</h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                    {selectedOrder.remark}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                关闭
              </button>
              {selectedOrder.status === 'PAID' && (
                <button
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, 'SHIPPED')
                    setShowDetailModal(false)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  标记为已发货
                </button>
              )}
              {selectedOrder.status === 'SHIPPED' && (
                <button
                  onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, 'DELIVERED')
                    setShowDetailModal(false)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  标记为已送达
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Batch Operation Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">批量操作</h3>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                已选择 {selectedOrders.length} 个订单，请选择要执行的操作：
              </p>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="batchStatus"
                    value="SHIPPED"
                    checked={batchStatus === 'SHIPPED'}
                    onChange={(e) => setBatchStatus(e.target.value)}
                    className="mr-2"
                  />
                  <span>标记为已发货</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="batchStatus"
                    value="DELIVERED"
                    checked={batchStatus === 'DELIVERED'}
                    onChange={(e) => setBatchStatus(e.target.value)}
                    className="mr-2"
                  />
                  <span>标记为已送达</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="batchStatus"
                    value="CANCELLED"
                    checked={batchStatus === 'CANCELLED'}
                    onChange={(e) => setBatchStatus(e.target.value)}
                    className="mr-2"
                  />
                  <span>取消订单</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBatchModal(false)
                  setBatchStatus('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleBatchUpdate}
                disabled={!batchStatus}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认操作
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 物流跟踪模态框 */}
      {showTrackingModal && trackingOrderId && (
        <TrackingModal
          isOpen={showTrackingModal}
          orderId={trackingOrderId}
          orderNo={trackingOrderNo}
          onClose={() => {
            setShowTrackingModal(false)
            setTrackingOrderId('')
            setTrackingOrderNo('')
          }}
        />
      )}
    </div>
  )
}