import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

interface OrderStats {
  status: string
  _count: {
    id: number
  }
}

// GET /api/orders - 获取订单列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        // { orderNumber: { contains: search, mode: 'insensitive' } }, // 注意：Order模型中没有orderNumber字段
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // 获取订单列表
    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true
              }
            }
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      }
    })

    // 获取总数
    const total = await prisma.order.count({ where })

    // 计算统计数据
    const stats = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    const statusStats = {
      PENDING: stats.find((s: OrderStats) => s.status === 'PENDING')?._count.id || 0,
      CONFIRMED: stats.find((s: OrderStats) => s.status === 'CONFIRMED')?._count.id || 0,
      PROCESSING: stats.find((s: OrderStats) => s.status === 'PROCESSING')?._count.id || 0,
      SHIPPED: stats.find((s: OrderStats) => s.status === 'SHIPPED')?._count.id || 0,
      DELIVERED: stats.find((s: OrderStats) => s.status === 'DELIVERED')?._count.id || 0,
      CANCELLED: stats.find((s: OrderStats) => s.status === 'CANCELLED')?._count.id || 0,
      REFUNDED: stats.find((s: OrderStats) => s.status === 'REFUNDED')?._count.id || 0
    }

    return NextResponse.json({
      success: true,
      data: {
        orders,
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
    console.error('获取订单列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取订单列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/orders - 创建新订单
export async function POST(request: NextRequest) {
  try {
    // 验证用户权限
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      items,
      shippingAddress,
      addressId, // 添加addressId字段
      paymentMethod,
      couponCode,
      notes
    } = body

    // 验证必填字段
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: '订单商品不能为空' },
        { status: 400 }
      )
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: '收货地址不能为空' },
        { status: 400 }
      )
    }

    // 验证商品库存和价格
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { success: false, error: `商品 ${item.productId} 不存在` },
          { status: 400 }
        )
      }

      if (!product.isActive) {
        return NextResponse.json(
          { success: false, error: `商品 ${product.name} 已下架` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `商品 ${product.name} 库存不足` },
          { status: 400 }
        )
      }

      const itemTotal = Number(product.price) * item.quantity
      totalAmount += itemTotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: Number(product.price)
      })
    }

    // 处理优惠券
    let discountAmount = 0
    let couponId = null

    if (couponCode) {
      // 简化优惠券查询，移除复杂的字段比较
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      })

      if (!coupon) {
        return NextResponse.json(
          { success: false, error: '优惠券无效或已过期' },
          { status: 400 }
        )
      }

      // 检查使用次数
      if (coupon.usedCount >= coupon.totalCount) {
        return NextResponse.json(
          { success: false, error: '优惠券已用完' },
          { status: 400 }
        )
      }

      // 检查最小订单金额
      if (coupon.minAmount && totalAmount < Number(coupon.minAmount)) {
        return NextResponse.json(
          { success: false, error: `订单金额需满 ${coupon.minAmount} 元才能使用此优惠券` },
          { status: 400 }
        )
      }

      // 计算折扣金额
      if (coupon.type === 'AMOUNT') {
        discountAmount = Math.min(Number(coupon.value), totalAmount)
      } else if (coupon.type === 'DISCOUNT') {
        discountAmount = Math.min(totalAmount * (Number(coupon.value) / 100), Number(coupon.maxDiscount) || totalAmount)
      }

      couponId = coupon.id
    }

    const finalAmount = totalAmount - discountAmount

    // 生成订单号
    const orderNo = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // 创建订单
    const order = await prisma.order.create({
      data: {
        orderNo,
        userId: user.userId,
        status: 'PENDING',
        totalAmount,
        discountAmount,
        finalAmount,
        addressId: addressId,
        paymentMethod,
        remark: notes,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // 更新商品库存
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // 更新优惠券使用次数
    // if (couponId) { // 注意：Order模型中没有couponId字段
    //   await prisma.coupon.update({
    //     where: { id: couponId },
    //     data: {
    //       usedCount: {
    //         increment: 1
    //       }
    //     }
    //   })
    // }

    return NextResponse.json({
      success: true,
      data: order,
      message: '订单创建成功'
    })
  } catch (error) {
    console.error('创建订单失败:', error)
    return NextResponse.json(
      { success: false, error: '创建订单失败' },
      { status: 500 }
    )
  }
}

// PUT /api/orders - 批量更新订单状态
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
    const { orderIds, status: newStatus, notes } = body

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择要更新的订单' },
        { status: 400 }
      )
    }

    if (!newStatus) {
      return NextResponse.json(
        { success: false, error: '请选择新的订单状态' },
        { status: 400 }
      )
    }

    // 批量更新订单状态
    const result = await prisma.order.updateMany({
      where: {
        id: {
          in: orderIds
        }
      },
      data: {
        status: newStatus,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message: `成功更新 ${result.count} 个订单状态`
    })
  } catch (error) {
    console.error('批量更新订单失败:', error)
    return NextResponse.json(
      { success: false, error: '批量更新订单失败' },
      { status: 500 }
    )
  }
}