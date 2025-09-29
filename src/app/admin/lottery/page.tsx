'use client'

import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  GiftIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'

interface Prize {
  id: string
  name: string
  type: 'physical' | 'virtual' | 'coupon' | 'points'
  value: number
  probability: number
  quantity: number
  remainingQuantity: number
  image: string
}

interface LotteryActivity {
  id: string
  name: string
  description: string
  type: 'newuser' | 'daily' | 'purchase' | 'special'
  status: 'draft' | 'active' | 'paused' | 'ended'
  startDate: string
  endDate: string
  participationLimit: number
  totalParticipants: number
  totalDraws: number
  prizes: Prize[]
  rules: string[]
  createdAt: string
  updatedAt: string
}

export default function LotteryPage() {
  const [activities, setActivities] = useState<LotteryActivity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<LotteryActivity | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const activitiesPerPage = 10

  useEffect(() => {
    // 模拟获取抽奖活动数据
    const mockActivities: LotteryActivity[] = [
      {
        id: '1',
        name: '新用户专享大转盘',
        description: '新用户注册即可参与抽奖，100%中奖',
        type: 'newuser',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        participationLimit: 1,
        totalParticipants: 1245,
        totalDraws: 1245,
        prizes: [
          {
            id: '1',
            name: '20元优惠券',
            type: 'coupon',
            value: 20,
            probability: 50,
            quantity: 1000,
            remainingQuantity: 755,
            image: '🎫'
          },
          {
            id: '2',
            name: '小米台灯',
            type: 'physical',
            value: 199,
            probability: 5,
            quantity: 100,
            remainingQuantity: 38,
            image: '💡'
          },
          {
            id: '3',
            name: '积分奖励',
            type: 'points',
            value: 100,
            probability: 30,
            quantity: 2000,
            remainingQuantity: 1623,
            image: '⭐'
          },
          {
            id: '4',
            name: '免运费券',
            type: 'coupon',
            value: 15,
            probability: 15,
            quantity: 500,
            remainingQuantity: 313,
            image: '🚚'
          }
        ],
        rules: [
          '每个新用户仅可参与一次',
          '奖品将在3个工作日内发放',
          '优惠券有效期30天',
          '活动最终解释权归商家所有'
        ],
        createdAt: '2024-01-01 10:00:00',
        updatedAt: '2024-01-15 14:30:00'
      },
      {
        id: '2',
        name: '每日签到抽奖',
        description: '每日签到即可获得一次抽奖机会',
        type: 'daily',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        participationLimit: 31,
        totalParticipants: 856,
        totalDraws: 2134,
        prizes: [
          {
            id: '5',
            name: '5元优惠券',
            type: 'coupon',
            value: 5,
            probability: 60,
            quantity: 2000,
            remainingQuantity: 1720,
            image: '🎫'
          },
          {
            id: '6',
            name: '积分奖励',
            type: 'points',
            value: 50,
            probability: 35,
            quantity: 1000,
            remainingQuantity: 853,
            image: '⭐'
          },
          {
            id: '7',
            name: '智能手环',
            type: 'physical',
            value: 299,
            probability: 5,
            quantity: 50,
            remainingQuantity: 39,
            image: '⌚'
          }
        ],
        rules: [
          '每日签到可获得一次抽奖机会',
          '连续签到7天可获得额外抽奖机会',
          '奖品将在24小时内发放',
          '活动期间每人最多可参与31次'
        ],
        createdAt: '2024-01-15 09:00:00',
        updatedAt: '2024-01-15 09:00:00'
      },
      {
        id: '3',
        name: '购物满额抽奖',
        description: '单笔订单满200元即可参与抽奖',
        type: 'purchase',
        status: 'paused',
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        participationLimit: 10,
        totalParticipants: 234,
        totalDraws: 456,
        prizes: [
          {
            id: '8',
            name: '50元优惠券',
            type: 'coupon',
            value: 50,
            probability: 40,
            quantity: 500,
            remainingQuantity: 456,
            image: '🎫'
          },
          {
            id: '9',
            name: '小米音箱',
            type: 'physical',
            value: 399,
            probability: 10,
            quantity: 30,
            remainingQuantity: 26,
            image: '🔊'
          }
        ],
        rules: [
          '单笔订单满200元可参与一次',
          '每人每天最多参与3次',
          '奖品将在订单完成后发放',
          '退款订单不可参与抽奖'
        ],
        createdAt: '2024-01-20 12:00:00',
        updatedAt: '2024-01-25 10:15:00'
      },
      {
        id: '4',
        name: '春节特别活动',
        description: '春节期间特别抽奖活动',
        type: 'special',
        status: 'draft',
        startDate: '2024-02-10',
        endDate: '2024-02-17',
        participationLimit: 5,
        totalParticipants: 0,
        totalDraws: 0,
        prizes: [
          {
            id: '10',
            name: '红包奖励',
            type: 'virtual',
            value: 88,
            probability: 20,
            quantity: 200,
            remainingQuantity: 200,
            image: '🧧'
          },
          {
            id: '11',
            name: '华为耳机',
            type: 'physical',
            value: 599,
            probability: 5,
            quantity: 20,
            remainingQuantity: 20,
            image: '🎧'
          }
        ],
        rules: [
          '活动期间每人最多参与5次',
          '需要分享活动才能参与',
          '奖品将在活动结束后统一发放',
          '中奖用户需要提供收货地址'
        ],
        createdAt: '2024-01-25 15:00:00',
        updatedAt: '2024-01-25 15:00:00'
      }
    ]
    setActivities(mockActivities)
  }, [])

  // 过滤活动
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || activity.type === filterType
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  // 分页
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage)
  const startIndex = (currentPage - 1) * activitiesPerPage
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + activitiesPerPage)

  const handleDeleteActivity = (activityId: string) => {
    if (confirm('Are you sure you want to delete this lottery activity?')) {
      setActivities(prev => prev.filter(activity => activity.id !== activityId))
    }
  }

  const handleToggleStatus = (activityId: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { 
            ...activity, 
            status: activity.status === 'active' ? 'paused' : 'active',
            updatedAt: new Date().toLocaleString()
          }
        : activity
    ))
  }

  const handleViewActivity = (activity: LotteryActivity) => {
    setSelectedActivity(activity)
    setShowDetailModal(true)
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'newuser': return '新用户活动'
      case 'daily': return '每日活动'
      case 'purchase': return '购物活动'
      case 'special': return '特别活动'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newuser': return 'bg-blue-100 text-blue-800'
      case 'daily': return 'bg-green-100 text-green-800'
      case 'purchase': return 'bg-purple-100 text-purple-800'
      case 'special': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿'
      case 'active': return '进行中'
      case 'paused': return '已暂停'
      case 'ended': return '已结束'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'ended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrizeTypeText = (type: string) => {
    switch (type) {
      case 'physical': return '实物'
      case 'virtual': return '虚拟'
      case 'coupon': return '优惠券'
      case 'points': return '积分'
      default: return type
    }
  }

  // 统计数据
  const stats = {
    total: activities.length,
    active: activities.filter(a => a.status === 'active').length,
    draft: activities.filter(a => a.status === 'draft').length,
    paused: activities.filter(a => a.status === 'paused').length,
    totalParticipants: activities.reduce((sum, a) => sum + a.totalParticipants, 0),
    totalDraws: activities.reduce((sum, a) => sum + a.totalDraws, 0)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">抽奖活动管理</h1>
          <p className="text-gray-600">管理所有抽奖活动和奖品配置</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>创建活动</span>
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总活动</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <GiftIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">进行中</p>
              <p className="text-xl font-bold text-green-600">{stats.active}</p>
            </div>
            <PlayIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">草稿</p>
              <p className="text-xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <PencilIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已暂停</p>
              <p className="text-xl font-bold text-yellow-600">{stats.paused}</p>
            </div>
            <PauseIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总参与人数</p>
              <p className="text-xl font-bold text-blue-600">{stats.totalParticipants}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总抽奖次数</p>
              <p className="text-xl font-bold text-purple-600">{stats.totalDraws}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-400" />
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
              placeholder="搜索活动名称或描述..."
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
            <option value="newuser">新用户活动</option>
            <option value="daily">每日活动</option>
            <option value="purchase">购物活动</option>
            <option value="special">特别活动</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有状态</option>
            <option value="draft">草稿</option>
            <option value="active">进行中</option>
            <option value="paused">已暂停</option>
            <option value="ended">已结束</option>
          </select>
        </div>
      </div>

      {/* Activities table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  活动信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  奖品数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  参与情况
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  活动时间
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
              {paginatedActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-500">{activity.description}</div>
                      <div className="text-sm text-gray-500">限制: {activity.participationLimit}次/人</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(activity.type)}`}>
                      {getTypeText(activity.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {activity.prizes.length} 种奖品
                    </div>
                    <div className="text-sm text-gray-500">
                      总库存: {activity.prizes.reduce((sum, p) => sum + p.quantity, 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      参与: {activity.totalParticipants} 人
                    </div>
                    <div className="text-sm text-gray-500">
                      抽奖: {activity.totalDraws} 次
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{activity.startDate}</div>
                    <div className="text-sm text-gray-500">至 {activity.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                      {getStatusText(activity.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewActivity(activity)}
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
                      
                      {(activity.status === 'active' || activity.status === 'paused') && (
                        <button
                          onClick={() => handleToggleStatus(activity.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            activity.status === 'active' 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {activity.status === 'active' ? '暂停' : '启动'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
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
                显示 {startIndex + 1} 到 {Math.min(startIndex + activitiesPerPage, filteredActivities.length)} 条，
                共 {filteredActivities.length} 条记录
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

      {/* Add activity modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">创建抽奖活动</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    活动名称
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入活动名称"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    活动类型
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="newuser">新用户活动</option>
                    <option value="daily">每日活动</option>
                    <option value="purchase">购物活动</option>
                    <option value="special">特别活动</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  活动描述
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入活动描述"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    参与限制
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="每人可参与次数"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  活动规则
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入活动规则，每行一条规则"
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
                  创建活动
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity detail modal */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">活动详情</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* 活动基本信息 */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold">{selectedActivity.name}</h4>
                    <p className="text-purple-100 mt-1">{selectedActivity.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedActivity.type)} text-gray-800`}>
                        {getTypeText(selectedActivity.type)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedActivity.status)} text-gray-800`}>
                        {getStatusText(selectedActivity.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{selectedActivity.totalParticipants}</div>
                    <div className="text-sm text-purple-100">参与人数</div>
                  </div>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedActivity.totalDraws}</div>
                  <div className="text-sm text-gray-600">总抽奖次数</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedActivity.participationLimit}</div>
                  <div className="text-sm text-gray-600">每人限制次数</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedActivity.prizes.length}</div>
                  <div className="text-sm text-gray-600">奖品种类</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedActivity.prizes.reduce((sum, p) => sum + p.quantity, 0)}
                  </div>
                  <div className="text-sm text-gray-600">奖品总数</div>
                </div>
              </div>

              {/* 奖品列表 */}
              <div>
                <h5 className="font-medium text-gray-900 mb-4">奖品配置</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedActivity.prizes.map((prize) => (
                    <div key={prize.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{prize.image}</span>
                          <div>
                            <div className="font-medium text-gray-900">{prize.name}</div>
                            <div className="text-sm text-gray-500">
                              {getPrizeTypeText(prize.type)} • 价值¥{prize.value}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{prize.probability}%</div>
                          <div className="text-xs text-gray-500">中奖率</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">库存情况</span>
                          <span className="text-gray-900">
                            {prize.remainingQuantity} / {prize.quantity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(prize.remainingQuantity / prize.quantity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 活动规则 */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">活动规则</h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {selectedActivity.rules.map((rule, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-600 mr-2">{index + 1}.</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 时间信息 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">活动时间：</span>
                  <span className="text-gray-900">{selectedActivity.startDate} 至 {selectedActivity.endDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">创建时间：</span>
                  <span className="text-gray-900">{selectedActivity.createdAt}</span>
                </div>
                <div>
                  <span className="text-gray-500">更新时间：</span>
                  <span className="text-gray-900">{selectedActivity.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}