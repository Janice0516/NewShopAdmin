'use client'

import { useState, useEffect } from 'react'
import {
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface StatCard {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
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
        icon: UsersIcon
      },
      {
        title: '商品总数',
        value: '456',
        change: '+3.2%',
        changeType: 'increase',
        icon: ShoppingBagIcon
      },
      {
        title: '订单总数',
        value: '2,890',
        change: '+8.1%',
        changeType: 'increase',
        icon: ClipboardDocumentListIcon
      },
      {
        title: '总收入',
        value: '¥128,456',
        change: '-2.4%',
        changeType: 'decrease',
        icon: CurrencyDollarIcon
      }
    ]
    setStats(mockStats)

    // 模拟获取最近订单
    const mockRecentOrders: RecentOrder[] = [
      {
        id: 'ORD001',
        customer: '张三',
        product: '小米智能台灯Pro',
        amount: 199,
        status: 'pending',
        date: '2024-01-15'
      },
      {
        id: 'ORD002',
        customer: '李四',
        product: '华为智能音箱',
        amount: 299,
        status: 'processing',
        date: '2024-01-15'
      },
      {
        id: 'ORD003',
        customer: '王五',
        product: '小米扫地机器人',
        amount: 1299,
        status: 'shipped',
        date: '2024-01-14'
      },
      {
        id: 'ORD004',
        customer: '赵六',
        product: '智能门锁',
        amount: 899,
        status: 'delivered',
        date: '2024-01-14'
      },
      {
        id: 'ORD005',
        customer: '钱七',
        product: '智能摄像头',
        amount: 399,
        status: 'pending',
        date: '2024-01-13'
      }
    ]
    setRecentOrders(mockRecentOrders)

    // 模拟获取热销商品
    const mockTopProducts: TopProduct[] = [
      {
        id: '1',
        name: '小米智能台灯Pro',
        sales: 156,
        revenue: 31044
      },
      {
        id: '2',
        name: '华为智能音箱',
        sales: 89,
        revenue: 26611
      },
      {
        id: '3',
        name: '小米扫地机器人',
        sales: 45,
        revenue: 58455
      },
      {
        id: '4',
        name: '智能门锁',
        sales: 67,
        revenue: 60233
      },
      {
        id: '5',
        name: '智能摄像头',
        sales: 123,
        revenue: 49077
      }
    ]
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
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600">欢迎回到管理后台</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.changeType === 'increase' ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs 上月</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                查看全部
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {order.id} - {order.customer}
                      </p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.product}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-semibold text-gray-900">¥{order.amount}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">热销商品</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                查看全部
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">销量: {product.sales}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">¥{product.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">收入</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">添加用户</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">添加商品</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <EyeIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">查看报告</span>
          </button>
        </div>
      </div>
    </div>
  )
}