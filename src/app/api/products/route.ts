import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'
import { validateProduct, defaultProductRules } from '@/utils/validation'
import { prisma } from '@/lib/prisma'
import { apiLimiter, rateLimit } from '@/middleware/rateLimit'

// 使用共享的Prisma实例而不是创建新实例
// const prisma = new PrismaClient()

// 内存缓存
interface CacheEntry {
  data: any
  timestamp: number
  etag: string
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 60000 // 增加到60秒缓存时间以减少数据库压力

// 生成ETag用于缓存验证
function generateETag(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16)
}

interface ProductStats {
  status: string
  _count: {
    id: number
  }
}

// GET /api/products - 获取商品列表（支持增量同步）
export async function GET(request: NextRequest) {
  // 应用限流
  const rateLimitResponse = rateLimit(apiLimiter)(request)
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const lastModified = searchParams.get('lastModified')

    // 生成缓存键
    const cacheKey = `products:${page}:${limit}:${search}:${category}:${status}:${sortBy}:${sortOrder}`
    
    // 检查缓存
    const cached = cache.get(cacheKey)
    const now = Date.now()
    
    // 如果有缓存且未过期
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      // 检查客户端的If-Modified-Since头
      const ifModifiedSince = request.headers.get('If-Modified-Since')
      if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(cached.timestamp)) {
        return new NextResponse(null, { 
          status: 304,
          headers: {
            'ETag': cached.etag,
            'Cache-Control': 'public, max-age=30',
            'Last-Modified': new Date(cached.timestamp).toUTCString()
          }
        })
      }
      
      return NextResponse.json(cached.data, {
        headers: {
          'ETag': cached.etag,
          'Cache-Control': 'public, max-age=30',
          'Last-Modified': new Date(cached.timestamp).toUTCString()
        }
      })
    }

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.category = category
    }
    
    if (status) {
      where.status = status
    }

    // 如果提供了lastModified，只返回更新的数据
    if (lastModified) {
      where.updatedAt = {
        gt: new Date(lastModified)
      }
    }

    // 获取商品列表
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        _count: {
          select: {
            orderItems: true
          }
        }
      }
    })

    // 获取总数
    const total = await prisma.product.count({ where })

    // 计算统计数据
    const statusStats = {
      active: 0,
      inactive: 0,
      draft: 0,
      outOfStock: 0
    }

    const responseData = {
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: statusStats,
        timestamp: now
      }
    }

    // 生成ETag
    const etag = generateETag(responseData)
    
    // 更新缓存
    cache.set(cacheKey, {
      data: responseData,
      timestamp: now,
      etag
    })

    return NextResponse.json(responseData, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=30',
        'Last-Modified': new Date(now).toUTCString()
      }
    })
  } catch (error) {
    console.error('获取商品列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取商品列表失败' },
      { status: 500 }
    )
  }
}

// 清除相关缓存
function clearProductCache() {
  const keysToDelete: string[] = []
  for (const key of cache.keys()) {
    if (key.startsWith('products:')) {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach(key => cache.delete(key))
}

// POST /api/products - 创建新商品
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    console.log('用户信息:', user)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      images
    } = body

    // 使用完善的数据校验系统
    const validationResult = validateProduct(body, defaultProductRules)
    
    if (!validationResult.isValid) {
      const errorMessages = Object.values(validationResult.errors).flat()
      return NextResponse.json(
        { 
          success: false, 
          error: '数据验证失败', 
          details: validationResult.errors,
          message: errorMessages.join('; ')
        },
        { status: 400 }
      )
    }

    // 额外的业务逻辑验证
    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: '指定的商品分类不存在' },
        { status: 400 }
      )
    }

    // 检查商品名称是否重复
    const existingProduct = await prisma.product.findFirst({
      where: { 
        name: name.trim(),
        categoryId: categoryId
      }
    })

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: '该分类下已存在同名商品' },
        { status: 400 }
      )
    }

    // 创建商品
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        categoryId,
        images: images || [],
        stock: parseInt(stock) || 0,
        isActive: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // 清除缓存以确保数据一致性
    clearProductCache()

    return NextResponse.json({
      success: true,
      data: product,
      message: '商品创建成功'
    })
  } catch (error) {
    console.error('创建商品失败:', error)
    return NextResponse.json(
      { success: false, error: '创建商品失败' },
      { status: 500 }
    )
  }
}

// PUT /api/products - 批量更新商品
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { productIds, updates } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择要更新的商品' },
        { status: 400 }
      )
    }

    // 批量更新商品
    const result = await prisma.product.updateMany({
      where: {
        id: {
          in: productIds
        }
      },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    })

    // 清除缓存以确保数据一致性
    clearProductCache()

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message: `成功更新 ${result.count} 个商品`
    })
  } catch (error) {
    console.error('批量更新商品失败:', error)
    return NextResponse.json(
      { success: false, error: '批量更新商品失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/products - 批量删除商品
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productIds = searchParams.get('ids')?.split(',') || []

    if (productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择要删除的商品' },
        { status: 400 }
      )
    }

    // 检查是否有关联的订单项
    const orderItems = await prisma.orderItem.findFirst({
      where: {
        productId: {
          in: productIds
        }
      }
    })

    if (orderItems) {
      return NextResponse.json(
        { success: false, error: '无法删除已有订单的商品' },
        { status: 400 }
      )
    }

    // 删除商品
    const result = await prisma.product.deleteMany({
      where: {
        id: {
          in: productIds
        }
      }
    })

    // 清除缓存以确保数据一致性
    clearProductCache()

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message: `成功删除 ${result.count} 个商品`
    })
  } catch (error) {
    console.error('批量删除商品失败:', error)
    return NextResponse.json(
      { success: false, error: '批量删除商品失败' },
      { status: 500 }
    )
  }
}