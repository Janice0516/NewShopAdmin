'use client'

import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  totalAmount: number
  shippingFee: number
  discount: number
  finalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  shippingAddress: {
    name: string
    phone: string
    address: string
  }
  createdAt: string
  updatedAt: string
  remark?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const ordersPerPage = 10

  useEffect(() => {
    // 模拟获取订单数据
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD20240115001',
        customer: {
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '13800138000'
        },
        items: [
          {
            id: '1',
            name: '小米智能台灯Pro',
            price: 199,
            quantity: 1,
            image: '💡'
          }
        ],
        totalAmount: 199,
        shippingFee: 15,
        discount: 0,
        finalAmount: 214,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: '支付宝',
        shippingAddress: {
          name: '张三',
          phone: '13800138000',
          address: '北京市朝阳区三里屯街道1号院2号楼3单元401室'
        },
        createdAt: '2024-01-15 10:30:00',
        updatedAt: '2024-01-15 10:30:00',
        remark: '请尽快发货'
      },
      {
        id: '2',
        orderNumber: 'ORD20240115002',
        customer: {
          name: '李四',
          email: 'lisi@example.com',
          phone: '13900139000'
        },
        items: [
          {
            id: '2',
            name: '华为智能音箱',
            price: 299,
            quantity: 2,
            image: '🔊'
          }
        ],
        totalAmount: 598,
        shippingFee: 0,
        discount: 50,
        finalAmount: 548,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: '微信支付',
        shippingAddress: {
          name: '李四',
          phone: '13900139000',
          address: '上海市浦东新区陆家嘴金融区世纪大道100号'
        },
        createdAt: '2024-01-15 09:15:00',
        updatedAt: '2024-01-15 11:20:00'
      },
      {
        id: '3',
        orderNumber: 'ORD20240114001',
        customer: {
          name: '王五',
          email: 'wangwu@example.com',
          phone: '13700137000'
        },
        items: [
          {
            id: '3',
            name: '小米扫地机器人',
            price: 1299,
            quantity: 1,
            image: '🤖'
          }
        ],
        totalAmount: 1299,
        shippingFee: 0,
        discount: 100,
        finalAmount: 1199,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: '信用卡',
        shippingAddress: {
          name: '王五',
          phone: '13700137000',
          address: '广州市天河区珠江新城花城大道123号'
        },
        createdAt: '2024-01-14 14:20:00',
        updatedAt: '2024-01-15 08:30:00'
      },
      {
        id: '4',
        orderNumber: 'ORD20240114002',
        customer: {
          name: '赵六',
          email: 'zhaoliu@example.com',
          phone: '13600136000'
        },
        items: [
          {
            id: '4',
            name: '智能门锁',
            price: 899,
            quantity: 1,
            image: '🔐'
          }
        ],
        totalAmount: 899,
        shippingFee: 15,
        discount: 0,
        finalAmount: 914,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: '支付宝',
        shippingAddress: {
          name: '赵六',
          phone: '13600136000',
          address: '深圳市南山区科技园南区深南大道9999号'
        },
        createdAt: '2024-01-14 16:45:00',
        updatedAt: '2024-01-15 12:00:00'
      },
      {
        id: '5',
        orderNumber: 'ORD20240113001',
        customer: {
          name: '钱七',
          email: 'qianqi@example.com',
          phone: '13500135000'
        },
        items: [
          {
            id: '5',
            name: '智能摄像头',
            price: 399,
            quantity: 1,
            image: '📹'
          }
        ],
        totalAmount: 399,
        shippingFee: 15,
        discount: 20,
        finalAmount: 394,
        status: 'cancelled',
        paymentStatus: 'refunded',
        paymentMethod: '微信支付',
        shippingAddress: {
          name: '钱七',
          phone: '13500135000',
          address: '杭州市西湖区文三路456号'
        },
        createdAt: '2024-01-13 11:30:00',
        updatedAt: '2024-01-14 09:15:00'
      }
    ]
    setOrders(mockOrders)
  }, [])

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  // 分页
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage)

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toLocaleString() }
        : order
    ))
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待确认'
      case 'confirmed': return '已确认'
      case 'processing': return '处理中'
      case 'shipped': return '已发货'
      case 'delivered': return '已送达'
      case 'cancelled': return '已取消'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待支付'
      case 'paid': return '已支付'
      case 'failed': return '支付失败'
      case 'refunded': return '已退款'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 统计数据
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'confirmed' || o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.finalAmount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
        <p className="text-gray-600">管理所有订单信息</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总订单</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">待处理</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">处理中</p>
              <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已发货</p>
              <p className="text-xl font-bold text-purple-600">{stats.shipped}</p>
            </div>
            <TruckIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成</p>
              <p className="text-xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总收入</p>
              <p className="text-xl font-bold text-green-600">¥{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号、客户姓名、邮箱或手机号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有状态</option>
            <option value="pending">待确认</option>
            <option value="confirmed">已确认</option>
            <option value="processing">处理中</option>
            <option value="shipped">已发货</option>
            <option value="delivered">已送达</option>
            <option value="cancelled">已取消</option>
          </select>
          
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有支付状态</option>
            <option value="pending">待支付</option>
            <option value="paid">已支付</option>
            <option value="failed">支付失败</option>
            <option value="refunded">已退款</option>
          </select>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支付状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.createdAt}</div>
                      <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                      <div className="text-sm text-gray-500">{order.customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <span className="mr-2">{item.image}</span>
                          <span className="text-gray-900">{item.name}</span>
                          <span className="text-gray-500 ml-1">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">¥{order.finalAmount}</div>
                    {order.discount > 0 && (
                      <div className="text-sm text-green-600">优惠: -¥{order.discount}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 text-xs px-2 py-1 bg-green-100 rounded"
                        >
                          确认
                        </button>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                          className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 bg-blue-100 rounded"
                        >
                          发货
                        </button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          className="text-purple-600 hover:text-purple-900 text-xs px-2 py-1 bg-purple-100 rounded"
                        >
                          完成
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 {startIndex + 1} 到 {Math.min(startIndex + ordersPerPage, filteredOrders.length)} 条，
                共 {filteredOrders.length} 条记录
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="text-sm text-gray-700">
                  第 {currentPage} 页，共 {totalPages} 页
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">订单详情</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* 订单基本信息 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">订单信息</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">订单号：</span>
                    <span className="text-gray-900">{selectedOrder.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">创建时间：</span>
                    <span className="text-gray-900">{selectedOrder.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">订单状态：</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">支付状态：</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {getPaymentStatusText(selectedOrder.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 客户信息 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">客户信息</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">姓名：</span>
                    <span className="text-gray-900">{selectedOrder.customer.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">邮箱：</span>
                    <span className="text-gray-900">{selectedOrder.customer.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">手机：</span>
                    <span className="text-gray-900">{selectedOrder.customer.phone}</span>
                  </div>
                </div>
              </div>

              {/* 收货地址 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">收货地址</h4>
                <div className="text-sm">
                  <div className="text-gray-900">
                    {selectedOrder.shippingAddress.name} {selectedOrder.shippingAddress.phone}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {selectedOrder.shippingAddress.address}
                  </div>
                </div>
              </div>

              {/* 商品信息 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">商品信息</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{item.image}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">¥{item.price} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ¥{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 费用明细 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">费用明细</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">商品小计：</span>
                    <span className="text-gray-900">¥{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">运费：</span>
                    <span className="text-gray-900">¥{selectedOrder.shippingFee}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">优惠：</span>
                      <span className="text-green-600">-¥{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span className="text-gray-900">总计：</span>
                    <span className="text-red-600">¥{selectedOrder.finalAmount}</span>
                  </div>
                </div>
              </div>

              {/* 备注 */}
              {selectedOrder.remark && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">订单备注</h4>
                  <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {selectedOrder.remark}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}