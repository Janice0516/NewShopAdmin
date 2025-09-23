'use client'

import { useState, useEffect } from 'react'

export default function DynamicSpacer() {
  const [topSpacing, setTopSpacing] = useState('pt-24') // 默认间距 (导航栏 + 公告栏)

  useEffect(() => {
    const updateSpacing = () => {
      if (typeof window !== 'undefined') {
        const isGoldenSeasonClosed = localStorage.getItem('golden-season-banner') === 'closed'
        const isPromotionalClosed = localStorage.getItem('promotional-banner') === 'closed'
        
        if (isGoldenSeasonClosed && isPromotionalClosed) {
          // 两个公告栏都关闭：只需要导航栏高度
          setTopSpacing('pt-16')
        } else if (isGoldenSeasonClosed || isPromotionalClosed) {
          // 一个公告栏关闭：导航栏 + 一个公告栏
          setTopSpacing('pt-20')
        } else {
          // 两个公告栏都显示：导航栏 + 两个公告栏
          setTopSpacing('pt-24')
        }
      }
    }

    updateSpacing()

    // 监听公告栏关闭事件
    const handleBannerClose = () => {
      setTimeout(updateSpacing, 100) // 延迟更新以确保localStorage已更新
    }

    window.addEventListener('bannerClosed', handleBannerClose)
    window.addEventListener('storage', updateSpacing)

    return () => {
      window.removeEventListener('bannerClosed', handleBannerClose)
      window.removeEventListener('storage', updateSpacing)
    }
  }, [])

  return <div className={`${topSpacing} transition-all duration-300`} />
}