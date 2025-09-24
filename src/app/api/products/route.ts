import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

interface ProductStats {
  status: string
  _count: {
    id: number
  }
}

// GET /api/products - 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

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

    // 计算统计数据 - 注意：Product模型中没有status字段
    // const stats = await prisma.product.groupBy({
    //   by: ['status'],
    //   _count: {
    //     id: true
    //   }
    // }) as ProductStats[]

    const statusStats = {
      // active: stats.find(s => s.status === 'active')?._count.id || 0,
      // inactive: stats.find(s => s.status === 'inactive')?._count.id || 0,
      // draft: stats.find(s => s.status === 'draft')?._count.id || 0
      active: 0,
      inactive: 0,
      draft: 0,
      outOfStock: 0
    }

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: statusStats
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

// POST /api/products - 创建新商品
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    console.log('用户信息:', user)
    if (!user || user.role !== 'ADMIN') {
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

    // 验证必填字段
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 检查SKU是否已存在 - 注意：Product模型中没有sku字段
    // const existingProduct = await prisma.product.findUnique({
    //   where: { sku }
    // })

    // if (existingProduct) {
    //   return NextResponse.json(
    //     { success: false, error: 'SKU已存在' },
    //     { status: 400 }
    //   )
    // }

    // 创建商品
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        images: images || [],
        stock: parseInt(stock) || 0,
        isActive: true
      }
    })

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