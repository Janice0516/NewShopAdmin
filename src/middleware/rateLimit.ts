import { NextRequest, NextResponse } from 'next/server'

// 简单的内存存储限流器
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly windowMs: number
  public readonly maxRequests: number // 改为public以便外部访问

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // 获取当前标识符的请求记录
    let requests = this.requests.get(identifier) || []
    
    // 清理过期的请求记录
    requests = requests.filter(timestamp => timestamp > windowStart)
    
    // 检查是否超过限制
    if (requests.length >= this.maxRequests) {
      return false
    }

    // 添加当前请求
    requests.push(now)
    this.requests.set(identifier, requests)

    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const requests = this.requests.get(identifier) || []
    const validRequests = requests.filter(timestamp => timestamp > windowStart)
    
    return Math.max(0, this.maxRequests - validRequests.length)
  }

  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || []
    if (requests.length === 0) return 0
    
    const oldestRequest = Math.min(...requests)
    return oldestRequest + this.windowMs
  }
}

// 创建不同级别的限流器
export const apiLimiter = new RateLimiter(60000, 100) // 每分钟100个请求
export const strictLimiter = new RateLimiter(60000, 20) // 每分钟20个请求

export function rateLimit(limiter: RateLimiter) {
  return (request: NextRequest) => {
    // 使用IP地址作为标识符，NextRequest没有ip属性，需要从headers获取
    const identifier = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      request.headers.get('cf-connecting-ip') ||
                      'anonymous'

    if (!limiter.isAllowed(identifier)) {
      const resetTime = limiter.getResetTime(identifier)
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)

      return NextResponse.json(
        { 
          success: false, 
          error: '请求过于频繁，请稍后再试',
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': limiter.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toString()
          }
        }
      )
    }

    const remaining = limiter.getRemainingRequests(identifier)
    const resetTime = limiter.getResetTime(identifier)

    // 添加限流头部信息
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', limiter.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', resetTime.toString())

    return response
  }
}