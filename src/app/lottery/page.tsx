'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GiftIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline'

interface Prize {
  id: string
  name: string
  image: string
  probability: number
  type: 'product' | 'coupon' | 'points'
  value?: number
}

// 奖品配置
const prizes: Prize[] = [
  {
    id: '1',
    name: '小米智能台灯Pro',
    image: '💡',
    probability: 0.01, // 1%
    type: 'product'
  },
  {
    id: '2',
    name: '100元优惠券',
    image: '🎫',
    probability: 0.05, // 5%
    type: 'coupon',
    value: 100
  },
  {
    id: '3',
    name: '50元优惠券',
    image: '🎫',
    probability: 0.1, // 10%
    type: 'coupon',
    value: 50
  },
  {
    id: '4',
    name: '20元优惠券',
    image: '🎫',
    probability: 0.2, // 20%
    type: 'coupon',
    value: 20
  },
  {
    id: '5',
    name: '100积分',
    image: '⭐',
    probability: 0.3, // 30%
    type: 'points',
    value: 100
  },
  {
    id: '6',
    name: '谢谢参与',
    image: '😊',
    probability: 0.34, // 34%
    type: 'points',
    value: 0
  }
]

export default function LotteryPage() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<Prize | null>(null)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; isNewUser: boolean } | null>(null)

  useEffect(() => {
    // 模拟检查用户登录状态和是否为新用户
    // 实际应用中应该从API获取
    const mockUser = {
      name: '新用户',
      isNewUser: true
    }
    setUserInfo(mockUser)
  }, [])

  const drawPrize = () => {
    if (isSpinning || hasDrawn) return

    setIsSpinning(true)
    
    // 模拟抽奖动画延迟
    setTimeout(() => {
      const random = Math.random()
      let cumulativeProbability = 0
      let selectedPrize = prizes[prizes.length - 1] // 默认最后一个奖品

      for (const prize of prizes) {
        cumulativeProbability += prize.probability
        if (random <= cumulativeProbability) {
          selectedPrize = prize
          break
        }
      }

      setResult(selectedPrize)
      setIsSpinning(false)
      setHasDrawn(true)
    }, 3000)
  }

  const resetLottery = () => {
    setResult(null)
    setHasDrawn(false)
    setIsSpinning(false)
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">加载中...</p>
        </div>
      </div>
    )
  }

  if (!userInfo.isNewUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                智能家居商城
              </Link>
              <nav className="flex space-x-8">
                <Link href="/products" className="text-gray-700 hover:text-gray-900">
                  商品
                </Link>
                <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                  购物车
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-6">🎁</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            抱歉，您已经不是新用户了
          </h1>
          <p className="text-gray-600 mb-8">
            新用户抽奖活动仅限首次注册用户参与
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            去购物
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              智能家居商城
            </Link>
            <nav className="flex space-x-8">
              <Link href="/products" className="text-white/80 hover:text-white">
                商品
              </Link>
              <Link href="/cart" className="text-white/80 hover:text-white">
                购物车
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            欢迎新用户！
          </h1>
          <p className="text-xl text-white/80 mb-2">
            恭喜您成功注册智能家居商城
          </p>
          <p className="text-lg text-white/70">
            每位新用户都有一次免费抽奖机会，快来试试手气吧！
          </p>
        </div>

        {/* 抽奖转盘 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">新用户专享抽奖</h2>
            
            {/* 转盘区域 */}
            <div className="relative mx-auto w-80 h-80 mb-8">
              <div className={`w-full h-full rounded-full border-8 border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center transition-transform duration-3000 ${
                isSpinning ? 'animate-spin' : ''
              }`}>
                <div className="text-center">
                  <GiftIcon className="h-16 w-16 text-yellow-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-gray-800">
                    {isSpinning ? '抽奖中...' : '点击抽奖'}
                  </p>
                </div>
              </div>
              
              {/* 指针 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
              </div>
            </div>

            {/* 抽奖按钮 */}
            {!hasDrawn && (
              <button
                onClick={drawPrize}
                disabled={isSpinning}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {isSpinning ? '抽奖中...' : '开始抽奖'}
              </button>
            )}

            {/* 抽奖结果 */}
            {result && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="text-center">
                  <div className="text-4xl mb-4">{result.image}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    恭喜您获得
                  </h3>
                  <p className="text-xl font-semibold text-blue-600 mb-4">
                    {result.name}
                  </p>
                  
                  {result.type === 'coupon' && result.value && result.value > 0 && (
                    <p className="text-sm text-gray-600 mb-4">
                      优惠券已自动添加到您的账户，购物时可直接使用
                    </p>
                  )}
                  
                  {result.type === 'points' && result.value && result.value > 0 && (
                    <p className="text-sm text-gray-600 mb-4">
                      积分已自动添加到您的账户
                    </p>
                  )}
                  
                  {result.type === 'product' && (
                    <p className="text-sm text-gray-600 mb-4">
                      恭喜您获得实物奖品！我们将在3个工作日内联系您确认收货地址
                    </p>
                  )}

                  <div className="flex justify-center space-x-4">
                    <Link
                      href="/products"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      去购物
                    </Link>
                    <button
                      onClick={resetLottery}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      再看一遍
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 奖品展示 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 text-center">奖品一览</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {prizes.map((prize) => (
              <div key={prize.id} className="bg-white/20 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{prize.image}</div>
                <p className="text-white font-medium text-sm">{prize.name}</p>
                <p className="text-white/70 text-xs mt-1">
                  {prize.probability ? (prize.probability * 100).toFixed(0) : '0'}% 概率
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 活动说明 */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">活动说明</h3>
          <ul className="text-white/80 text-sm space-y-2">
            <li>• 每位新注册用户仅有一次抽奖机会</li>
            <li>• 优惠券和积分将自动添加到您的账户</li>
            <li>• 实物奖品将在3个工作日内联系您确认收货信息</li>
            <li>• 本活动最终解释权归智能家居商城所有</li>
          </ul>
        </div>
      </div>
    </div>
  )
}