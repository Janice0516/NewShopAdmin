import { useState, useEffect, useCallback } from 'react'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  categoryId: string
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface UseRealTimeSyncOptions {
  endpoint: string
  pollInterval?: number
  onUpdate?: (data: any) => void
  onError?: (error: Error) => void
}

export function useRealTimeSync<T>({
  endpoint,
  pollInterval = 5000,
  onUpdate,
  onError
}: UseRealTimeSyncOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const url = new URL(endpoint, window.location.origin)
      
      // 添加lastModified参数用于增量同步
      if (lastUpdated) {
        url.searchParams.set('lastModified', lastUpdated.toISOString())
      }

      const response = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          // 添加If-Modified-Since头部
          ...(lastUpdated && { 'If-Modified-Since': lastUpdated.toISOString() })
        }
      })

      // 处理304 Not Modified响应
      if (response.status === 304) {
        // 数据未修改，不需要更新
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        setLastUpdated(new Date())
        onUpdate?.(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
      
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }, [endpoint, lastUpdated, onUpdate, onError])

  // 手动刷新数据
  const refresh = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  // 增量更新单个项目
  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setData(prevData => {
      if (!prevData || !Array.isArray(prevData)) return prevData
      
      return (prevData as any[]).map(item => 
        item.id === id ? { ...item, ...updates } : item
      ) as T
    })
  }, [])

  // 添加新项目
  const addItem = useCallback((newItem: T) => {
    setData(prevData => {
      if (!prevData) return [newItem] as T
      if (!Array.isArray(prevData)) return prevData
      
      return [newItem, ...prevData] as T
    })
  }, [])

  // 删除项目
  const removeItem = useCallback((id: string) => {
    setData(prevData => {
      if (!prevData || !Array.isArray(prevData)) return prevData
      
      return (prevData as any[]).filter(item => item.id !== id) as T
    })
  }, [])

  useEffect(() => {
    fetchData()
    
    // 设置轮询
    const interval = setInterval(fetchData, pollInterval)
    
    return () => clearInterval(interval)
  }, [fetchData, pollInterval])

  // 页面可见性变化时刷新数据
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [refresh])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    updateItem,
    addItem,
    removeItem
  }
}

// 专门用于商品数据的Hook
export function useProductSync() {
  return useRealTimeSync<Product[]>({
    endpoint: '/api/products',
    pollInterval: 5000, // 增加到5秒轮询，减少服务器压力
    onUpdate: (data) => {
      console.log('商品数据已更新:', data.products?.length || 0, '个商品')
    },
    onError: (error) => {
      console.error('商品数据同步失败:', error)
    }
  })
}