'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    activeUsers: number
    newUsers: number
    completedOrders: number
    pendingOrders: number
  }
  sales: {
    dailySales: Array<{
      date: string
      amount: number
      orders: number
    }>
    categorySales: Array<{
      category: string
      amount: number
      percentage: number
    }>
    monthlyTrend: Array<{
      month: string
      revenue: number
      orders: number
    }>
  }
  products: {
    topSelling: Array<{
      id: string
      name: string
      sales: number
      revenue: number
    }>
    lowStock: Array<{
      id: string
      name: string
      stock: number
      price: number
    }>
    categoryStats: Array<{
      category: string
      count: number
    }>
  }
  users: {
    registrationTrend: Array<{
      date: string
      count: number
    }>
    topCustomers: Array<{
      id: string
      name: string
      email: string
      totalSpent: number
      orderCount: number
    }>
    usersByRole: Array<{
      role: string
      count: number
    }>
  }
  orders: {
    statusDistribution: Array<{
      status: string
      count: number
      percentage: number
    }>
    paymentMethods: Array<{
      method: string
      count: number
      amount: number
    }>
    averageOrderValue: number
    orderTrend: Array<{
      date: string
      count: number
      amount: number
    }>
  }
}

export default function EnhancedAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: 'all',
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      })

      const response = await fetch(`/api/analytics?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        console.error('获取分析数据失败:', result.error)
      }
    } catch (error) {
      console.error('获取分析数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format: 'excel'
      })

      const response = await fetch(`/api/analytics/export?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${dateRange.startDate}-${dateRange.endDate}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('导出报表失败:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-CN').format(num)
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    )
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

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">暂无数据</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题和操作 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
              <p className="mt-2 text-gray-600">查看业务数据和趋势分析</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* 日期范围选择 */}
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">至</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={exportReport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                导出报表
              </button>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: '概览', icon: ChartBarIcon },
              { id: 'sales', name: '销售分析', icon: CurrencyDollarIcon },
              { id: 'orders', name: '订单分析', icon: ShoppingCartIcon },
              { id: 'users', name: '用户分析', icon: UsersIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 概览标签页 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 核心指标卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">总收入</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(data.overview.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">总订单数</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(data.overview.totalOrders)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">总用户数</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(data.overview.totalUsers)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <UsersIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">活跃用户</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(data.overview.activeUsers)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* 订单状态分布 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">订单状态分布</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {data.orders.statusDistribution.map((status) => (
                  <div key={status.status} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {status.count}
                    </div>
                    <div className="text-sm text-gray-600">
                      {status.status === 'PENDING' && '待付款'}
                      {status.status === 'PAID' && '已付款'}
                      {status.status === 'SHIPPED' && '已发货'}
                      {status.status === 'DELIVERED' && '已送达'}
                      {status.status === 'CANCELLED' && '已取消'}
                      {status.status === 'REFUNDED' && '已退款'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {status.percentage ? status.percentage.toFixed(1) : '0.0'}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 销售分析标签页 */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* 销售趋势图表 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">销售趋势</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>图表组件待集成 (可使用 Chart.js 或 Recharts)</p>
              </div>
            </div>

            {/* 分类销售统计 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">分类销售统计</h3>
              <div className="space-y-4">
                {data.sales.categorySales.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {category.category}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 订单分析标签页 */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* 订单统计 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-sm text-gray-600 mb-2">平均订单价值</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.orders.averageOrderValue)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-sm text-gray-600 mb-2">已完成订单</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(data.overview.completedOrders)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-sm text-gray-600 mb-2">待处理订单</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(data.overview.pendingOrders)}
                </p>
              </div>
            </div>

            {/* 支付方式统计 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">支付方式统计</h3>
              <div className="space-y-4">
                {data.orders.paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{method.method}</p>
                      <p className="text-sm text-gray-600">{method.count} 笔订单</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(method.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 用户分析标签页 */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* 用户统计 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">用户角色分布</h3>
                <div className="space-y-3">
                  {data.users.usersByRole.map((role, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {role.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatNumber(role.count)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">新用户注册</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {formatNumber(data.overview.newUsers)}
                  </p>
                  <p className="text-sm text-gray-600">本期新增用户</p>
                </div>
              </div>
            </div>

            {/* 优质客户 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">优质客户</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        客户
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        邮箱
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        总消费
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        订单数
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.users.topCustomers.slice(0, 10).map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(customer.totalSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.orderCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}