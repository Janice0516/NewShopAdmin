'use client'

import { useState, useEffect } from 'react'
import {
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface StatCard {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface RecentOrder {
  id: string
  customer: string
  product: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
}

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])

  useEffect(() => {
    // 模拟获取统计数据
    const mockStats: StatCard[] = [
      {
        title: '总用户数',
        value: '1,234',
        change: '+12.5%',
        changeType: 'increase',
        icon: UsersIcon,
        color: 'bg-blue-500'
      },
      {
        title: '总商品数',
        value: '567',
        change: '+8.2%',
        changeType: 'increase',
        icon: ShoppingBagIcon,
        color: 'bg-green-500'
      },
      {
        title: '待处理订单',
        value: '89',
        change: '-3.1%',
        changeType: 'decrease',
        icon: ClipboardDocumentListIcon,
        color: 'bg-yellow-500'
      },
      {
        title: '本月收入',
        value: '¥45,678',
        change: '+15.3%',
        changeType: 'increase',
        icon: CurrencyDollarIcon,
        color: 'bg-purple-500'
      }
    ]

    const mockRecentOrders: RecentOrder[] = [
      {
        id: '001',
        customer: '张三',
        product: 'iPhone 15 Pro',
        amount: 8999,
        status: 'pending',
        date: '2024-01-15'
      },
      {
        id: '002',
        customer: '李四',
        product: 'MacBook Air',
        amount: 7999,
        status: 'processing',
        date: '2024-01-14'
      },
      {
        id: '003',
        customer: '王五',
        product: 'iPad Pro',
        amount: 6799,
        status: 'shipped',
        date: '2024-01-13'
      },
      {
        id: '004',
        customer: '赵六',
        product: 'Apple Watch',
        amount: 2999,
        status: 'delivered',
        date: '2024-01-12'
      }
    ]

    const mockTopProducts: TopProduct[] = [
      { id: '1', name: 'iPhone 15 Pro', sales: 156, revenue: 1403544 },
      { id: '2', name: 'MacBook Air', sales: 89, revenue: 711911 },
      { id: '3', name: 'iPad Pro', sales: 67, revenue: 455533 },
      { id: '4', name: 'Apple Watch', sales: 134, revenue: 401866 },
      { id: '5', name: 'AirPods Pro', sales: 203, revenue: 355270 }
    ]

    setStats(mockStats)
    setRecentOrders(mockRecentOrders)
    setTopProducts(mockTopProducts)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理'
      case 'processing':
        return '处理中'
      case 'shipped':
        return '已发货'
      case 'delivered':
        return '已送达'
      default:
        return status
    }
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">管理仪表盘</h1>
        <p className="text-gray-600 mt-2">欢迎回来！这里是您的商城管理概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ml-1 ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近订单 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{order.customer}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.product}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-gray-900">¥{order.amount.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                查看所有订单
              </button>
            </div>
          </div>
        </div>

        {/* 热销商品 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">热销商品</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.sales} 件销售</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">¥{product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">收入</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                查看所有商品
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <UsersIcon className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">用户管理</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <ShoppingBagIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">商品管理</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <ClipboardDocumentListIcon className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-900">订单管理</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">数据统计</span>
          </button>
        </div>
      </div>
    </div>
  )
}