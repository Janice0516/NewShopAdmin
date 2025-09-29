'use client'

import { useState } from 'react'
import SalesChart from '@/components/admin/charts/SalesChart'
import CategoryChart from '@/components/admin/charts/CategoryChart'
import OrderStatusChart from '@/components/admin/charts/OrderStatusChart'
import UserGrowthChart from '@/components/admin/charts/UserGrowthChart'

export default function TestAnalyticsPage() {
  const [testData] = useState({
    sales: [
      { date: '2024-01-01', amount: 12500, orders: 45 },
      { date: '2024-01-02', amount: 15200, orders: 52 },
      { date: '2024-01-03', amount: 18900, orders: 67 },
      { date: '2024-01-04', amount: 16800, orders: 58 },
      { date: '2024-01-05', amount: 22100, orders: 78 },
      { date: '2024-01-06', amount: 19500, orders: 69 },
      { date: '2024-01-07', amount: 25300, orders: 89 }
    ],
    categories: [
      { category: '手机数码', amount: 45000, percentage: 45 },
      { category: '电脑办公', amount: 25000, percentage: 25 },
      { category: '家用电器', amount: 15000, percentage: 15 },
      { category: '服装鞋包', amount: 10000, percentage: 10 },
      { category: '其他', amount: 5000, percentage: 5 }
    ],
    orderStatus: [
      { status: 'PENDING', count: 45, percentage: 25 },
      { status: 'CONFIRMED', count: 67, percentage: 37 },
      { status: 'SHIPPED', count: 34, percentage: 19 },
      { status: 'DELIVERED', count: 28, percentage: 15 },
      { status: 'CANCELLED', count: 6, percentage: 3 },
      { status: 'REFUNDED', count: 2, percentage: 1 }
    ],
    userGrowth: [
      { date: '2024-01-01', newUsers: 25, totalUsers: 156 },
      { date: '2024-01-02', newUsers: 32, totalUsers: 189 },
      { date: '2024-01-03', newUsers: 28, totalUsers: 203 },
      { date: '2024-01-04', newUsers: 35, totalUsers: 178 },
      { date: '2024-01-05', newUsers: 42, totalUsers: 234 },
      { date: '2024-01-06', newUsers: 38, totalUsers: 198 },
      { date: '2024-01-07', newUsers: 45, totalUsers: 267 }
    ]
  })

  const testExport = async () => {
    try {
      const response = await fetch('/api/analytics/export?format=json&startDate=2024-01-01&endDate=2024-01-31')
      const data = await response.json()
      console.log('Export test result:', data)
      alert(data.success ? 'Export test succeeded!' : `Export test failed: ${data.error}`)
    } catch (error) {
      console.error('Export test error:', error)
      alert('Export test error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">分析功能测试页面</h1>
          <button
            onClick={testExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            测试报表导出
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">销售趋势图表</h3>
            <SalesChart data={testData.sales} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">分类销售占比</h3>
            <CategoryChart data={testData.categories} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">用户增长趋势</h3>
            <UserGrowthChart data={testData.userGrowth} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">订单状态分布</h3>
            <OrderStatusChart data={testData.orderStatus} />
          </div>
        </div>
      </div>
    </div>
  )
}