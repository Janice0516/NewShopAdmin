'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ArrowPathIcon,
  EyeIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

interface SalesData {
  date: string
  sales: number
  orders: number
  users: number
}

interface ProductSales {
  name: string
  sales: number
  quantity: number
  revenue: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

interface UserAnalytics {
  date: string
  newUsers: number
  activeUsers: number
  retention: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('30d')
  const [isClient, setIsClient] = useState(false)
  
  // 数据状态
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
    conversionGrowth: 0
  })
  
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [productSales, setProductSales] = useState<ProductSales[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([])

  useEffect(() => {
    setIsClient(true)
    loadAnalyticsData()
  }, [dateRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟销售数据
    const mockSalesData: SalesData[] = [
      { date: '2024-01-01', sales: 12500, orders: 45, users: 38 },
      { date: '2024-01-02', sales: 15200, orders: 52, users: 42 },
      { date: '2024-01-03', sales: 18900, orders: 67, users: 55 },
      { date: '2024-01-04', sales: 16800, orders: 58, users: 48 },
      { date: '2024-01-05', sales: 22100, orders: 78, users: 65 },
      { date: '2024-01-06', sales: 19500, orders: 69, users: 58 },
      { date: '2024-01-07', sales: 25300, orders: 89, users: 72 }
    ]
    
    // 模拟商品销售数据
    const mockProductSales: ProductSales[] = [
      { name: 'iPhone 15 Pro', sales: 156, quantity: 156, revenue: 234000 },
      { name: '小米13 Ultra', sales: 234, quantity: 234, revenue: 187200 },
      { name: 'MacBook Pro', sales: 89, quantity: 89, revenue: 178000 },
      { name: 'iPad Air', sales: 167, quantity: 167, revenue: 100200 },
      { name: '华为P60 Pro', sales: 198, quantity: 198, revenue: 118800 },
      { name: 'AirPods Pro', sales: 345, quantity: 345, revenue: 69000 },
      { name: '小米手环8', sales: 567, quantity: 567, revenue: 56700 },
      { name: '华为Watch GT4', sales: 234, quantity: 234, revenue: 46800 }
    ]
    
    // 模拟分类数据
    const mockCategoryData: CategoryData[] = [
      { name: '手机数码', value: 45, color: '#8884d8' },
      { name: '电脑办公', value: 25, color: '#82ca9d' },
      { name: '家用电器', value: 15, color: '#ffc658' },
      { name: '服装鞋包', value: 10, color: '#ff7300' },
      { name: '其他', value: 5, color: '#00ff00' }
    ]
    
    // 模拟用户分析数据
    const mockUserAnalytics: UserAnalytics[] = [
      { date: '2024-01-01', newUsers: 25, activeUsers: 156, retention: 78 },
      { date: '2024-01-02', newUsers: 32, activeUsers: 189, retention: 82 },
      { date: '2024-01-03', newUsers: 28, activeUsers: 203, retention: 85 },
      { date: '2024-01-04', newUsers: 35, activeUsers: 178, retention: 79 },
      { date: '2024-01-05', newUsers: 42, activeUsers: 234, retention: 88 },
      { date: '2024-01-06', newUsers: 38, activeUsers: 198, retention: 84 },
      { date: '2024-01-07', newUsers: 45, activeUsers: 267, retention: 91 }
    ]
    
    setSalesData(mockSalesData)
    setProductSales(mockProductSales)
    setCategoryData(mockCategoryData)
    setUserAnalytics(mockUserAnalytics)
    setLoading(false)
  }

  // 计算统计指标
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0)
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0)
  const totalUsers = salesData.reduce((sum, item) => sum + item.users, 0)
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  // 计算增长率（模拟）
  const salesGrowth = 12.5
  const ordersGrowth = 8.3
  const usersGrowth = 15.7
  const avgOrderGrowth = 3.2

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('zh-CN').format(value)
  }

  const getDateRangeText = (range: string) => {
    switch (range) {
      case '7d': return '最近7天'
      case '30d': return '最近30天'
      case '90d': return '最近90天'
      case '1y': return '最近1年'
      default: return '最近7天'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据统计</h1>
          <p className="text-gray-600">查看销售数据、用户分析和业务指标</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="1y">最近1年</option>
          </select>
          <button
            onClick={loadAnalyticsData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>刷新数据</span>
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总销售额</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
              <div className="flex items-center mt-2">
                {salesGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(salesGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs 上期</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">订单数量</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalOrders)}</p>
              <div className="flex items-center mt-2">
                {ordersGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(ordersGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs 上期</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCartIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">新增用户</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalUsers)}</p>
              <div className="flex items-center mt-2">
                {usersGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(usersGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs 上期</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均订单价值</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgOrderValue)}</p>
              <div className="flex items-center mt-2">
                {avgOrderGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${avgOrderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(avgOrderGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs 上期</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales trend data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">销售趋势数据</h3>
            <span className="text-sm text-gray-500">{getDateRangeText(dateRange)}</span>
          </div>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {salesData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {isClient ? new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : item.date}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.orders} 订单 • {item.users} 新用户
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{formatCurrency(item.sales)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">分类销售占比</h3>
            <span className="text-sm text-gray-500">按销售额</span>
          </div>
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-3" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 mr-2">{category.value}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${category.value}%`,
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">热销商品排行</h3>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productSales.slice(0, 8).map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">销量: {product.quantity} 件</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                  <div className="text-sm text-gray-500">收入</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">用户分析数据</h3>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {userAnalytics.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="text-sm text-gray-500">日期</div>
                    <div className="font-medium text-gray-900">
                      {isClient ? new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : item.date}
                    </div>
                  </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">新用户</div>
                  <div className="font-medium text-blue-600">{item.newUsers}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">活跃用户</div>
                  <div className="font-medium text-green-600">{item.activeUsers}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">留存率</div>
                  <div className="font-medium text-purple-600">{item.retention}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick insights */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">数据洞察</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">销售增长</span>
            </div>
            <p className="text-sm text-blue-100">
              相比上期，销售额增长了 {salesGrowth}%，主要得益于新用户增长和客单价提升。
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">用户活跃</span>
            </div>
            <p className="text-sm text-blue-100">
              新用户增长 {usersGrowth}%，用户留存率保持在较高水平，用户粘性良好。
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <GiftIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">商品表现</span>
            </div>
            <p className="text-sm text-blue-100">
              手机数码类商品占销售额的 45%，是主要收入来源，建议加大推广力度。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}