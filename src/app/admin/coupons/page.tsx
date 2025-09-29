'use client'

import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  TicketIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Coupon {
  id: string
  name: string
  code: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number
  minAmount: number
  maxDiscount?: number
  usageLimit: number
  usedCount: number
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'expired'
  description: string
  createdAt: string
  updatedAt: string
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const couponsPerPage = 10

  useEffect(() => {
    // 模拟获取优惠券数据
    const mockCoupons: Coupon[] = [
      {
        id: '1',
        name: '新用户专享',
        code: 'NEWUSER20',
        type: 'percentage',
        value: 20,
        minAmount: 100,
        maxDiscount: 50,
        usageLimit: 1000,
        usedCount: 245,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        description: '新用户首次购买享受8折优惠',
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-15 14:30:00'
      },
      {
        id: '2',
        name: '满减优惠券',
        code: 'SAVE50',
        type: 'fixed',
        value: 50,
        minAmount: 300,
        usageLimit: 500,
        usedCount: 123,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        status: 'active',
        description: '满300减50元',
        createdAt: '2024-01-15 09:00:00',
        updatedAt: '2024-01-15 09:00:00'
      },
      {
        id: '3',
        name: '免运费券',
        code: 'FREESHIP',
        type: 'shipping',
        value: 0,
        minAmount: 99,
        usageLimit: 2000,
        usedCount: 567,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        status: 'active',
        description: '满99元免运费',
        createdAt: '2024-01-01 08:00:00',
        updatedAt: '2024-01-10 16:20:00'
      },
      {
        id: '4',
        name: '春节特惠',
        code: 'SPRING2024',
        type: 'percentage',
        value: 15,
        minAmount: 200,
        maxDiscount: 100,
        usageLimit: 800,
        usedCount: 456,
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        status: 'inactive',
        description: '春节期间85折优惠',
        createdAt: '2024-01-20 12:00:00',
        updatedAt: '2024-01-25 10:15:00'
      },
      {
        id: '5',
        name: '过期优惠券',
        code: 'EXPIRED10',
        type: 'percentage',
        value: 10,
        minAmount: 50,
        maxDiscount: 30,
        usageLimit: 100,
        usedCount: 89,
        startDate: '2023-12-01',
        endDate: '2023-12-31',
        status: 'expired',
        description: '已过期的优惠券',
        createdAt: '2023-12-01 10:00:00',
        updatedAt: '2024-01-01 00:00:00'
      }
    ]
    setCoupons(mockCoupons)
  }, [])

  // 过滤优惠券
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || coupon.type === filterType
    const matchesStatus = filterStatus === 'all' || coupon.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  // 分页
  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage)
  const startIndex = (currentPage - 1) * couponsPerPage
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + couponsPerPage)

  const handleDeleteCoupon = (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(prev => prev.filter(coupon => coupon.id !== couponId))
    }
  }

  const handleToggleStatus = (couponId: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === couponId 
        ? { 
            ...coupon, 
            status: coupon.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toLocaleString()
          }
        : coupon
    ))
  }

  const handleViewCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setShowDetailModal(true)
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'percentage': return '百分比折扣'
      case 'fixed': return '固定金额'
      case 'shipping': return '免运费'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-800'
      case 'fixed': return 'bg-green-100 text-green-800'
      case 'shipping': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '启用'
      case 'inactive': return '禁用'
      case 'expired': return '已过期'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDiscountValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.value}%${coupon.maxDiscount ? ` (最高¥${coupon.maxDiscount})` : ''}`
      case 'fixed':
        return `¥${coupon.value}`
      case 'shipping':
        return '免运费'
      default:
        return coupon.value.toString()
    }
  }

  // 统计数据
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.status === 'active').length,
    inactive: coupons.filter(c => c.status === 'inactive').length,
    expired: coupons.filter(c => c.status === 'expired').length,
    totalUsed: coupons.reduce((sum, c) => sum + c.usedCount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">优惠券管理</h1>
          <p className="text-gray-600">管理所有优惠券和促销活动</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>添加优惠券</span>
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总优惠券</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <TicketIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">启用中</p>
              <p className="text-xl font-bold text-green-600">{stats.active}</p>
            </div>
            <TicketIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已禁用</p>
              <p className="text-xl font-bold text-yellow-600">{stats.inactive}</p>
            </div>
            <TicketIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已过期</p>
              <p className="text-xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总使用次数</p>
              <p className="text-xl font-bold text-blue-600">{stats.totalUsed}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-400" />
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
              placeholder="搜索优惠券名称、代码或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有类型</option>
            <option value="percentage">百分比折扣</option>
            <option value="fixed">固定金额</option>
            <option value="shipping">免运费</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有状态</option>
            <option value="active">启用</option>
            <option value="inactive">禁用</option>
            <option value="expired">已过期</option>
          </select>
        </div>
      </div>

      {/* Coupons table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  优惠券信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  优惠内容
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用条件
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用情况
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  有效期
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
              {paginatedCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{coupon.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{coupon.code}</div>
                      <div className="text-sm text-gray-500">{coupon.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(coupon.type)}`}>
                      {getTypeText(coupon.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDiscountValue(coupon)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      满¥{coupon.minAmount}可用
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{coupon.startDate}</div>
                    <div className="text-sm text-gray-500">至 {coupon.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(coupon.status)}`}>
                      {getStatusText(coupon.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewCoupon(coupon)}
                        className="text-blue-600 hover:text-blue-900"
                        title="查看详情"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="编辑"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      {coupon.status !== 'expired' && (
                        <button
                          onClick={() => handleToggleStatus(coupon.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            coupon.status === 'active' 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {coupon.status === 'active' ? '禁用' : '启用'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-red-600 hover:text-red-900"
                        title="删除"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
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
                显示 {startIndex + 1} 到 {Math.min(startIndex + couponsPerPage, filteredCoupons.length)} 条，
                共 {filteredCoupons.length} 条记录
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

      {/* Add coupon modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">添加优惠券</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  优惠券名称
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入优惠券名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  优惠券代码
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入优惠券代码"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  优惠类型
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="percentage">百分比折扣</option>
                  <option value="fixed">固定金额</option>
                  <option value="shipping">免运费</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    优惠值
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最低消费
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  使用限制
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入使用次数限制"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入优惠券描述"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  创建优惠券
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon detail modal */}
      {showDetailModal && selectedCoupon && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">优惠券详情</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold">{selectedCoupon.name}</h4>
                    <p className="text-blue-100">{selectedCoupon.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatDiscountValue(selectedCoupon)}</div>
                    <div className="text-sm text-blue-100">满¥{selectedCoupon.minAmount}可用</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-400">
                  <div className="text-sm font-mono bg-white bg-opacity-20 px-2 py-1 rounded inline-block">
                    {selectedCoupon.code}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">优惠类型：</span>
                  <span className="text-gray-900">{getTypeText(selectedCoupon.type)}</span>
                </div>
                <div>
                  <span className="text-gray-500">状态：</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCoupon.status)}`}>
                    {getStatusText(selectedCoupon.status)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">使用次数：</span>
                  <span className="text-gray-900">{selectedCoupon.usedCount} / {selectedCoupon.usageLimit}</span>
                </div>
                <div>
                  <span className="text-gray-500">使用率：</span>
                  <span className="text-gray-900">{selectedCoupon.usedCount && selectedCoupon.usageLimit ? ((selectedCoupon.usedCount / selectedCoupon.usageLimit) * 100).toFixed(1) : '0.0'}%</span>
                </div>
                <div>
                  <span className="text-gray-500">开始时间：</span>
                  <span className="text-gray-900">{selectedCoupon.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">结束时间：</span>
                  <span className="text-gray-900">{selectedCoupon.endDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">创建时间：</span>
                  <span className="text-gray-900">{selectedCoupon.createdAt}</span>
                </div>
                <div>
                  <span className="text-gray-500">更新时间：</span>
                  <span className="text-gray-900">{selectedCoupon.updatedAt}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">使用进度</h5>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${(selectedCoupon.usedCount / selectedCoupon.usageLimit) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>已使用 {selectedCoupon.usedCount} 次</span>
                  <span>剩余 {selectedCoupon.usageLimit - selectedCoupon.usedCount} 次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}