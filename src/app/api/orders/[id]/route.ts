import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/orders/[id] - 获取订单详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const orderId = params.id

    // 构建查询条件
    const where: any = { id: orderId }
    
    // 如果不是管理员，只能查看自己的订单
    if (user.role !== 'ADMIN') {
      where.userId = user.userId
    }

    const order = await prisma.order.findUnique({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                description: true
              }
            }
          }
        },
        coupons: {
          include: {
            coupon: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
                value: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: '订单不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('获取订单详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取订单详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - 更新订单状态
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const orderId = params.id
    const body = await request.json()
    const { status, remark, trackingNumber, shippingCompany } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: '请选择订单状态' },
        { status: 400 }
      )
    }

    // 验证订单是否存在
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: '订单不存在' },
        { status: 404 }
      )
    }

    // 更新订单
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (remark !== undefined) {
      updateData.remark = remark
    }

    // 如果是发货状态，添加物流信息
    if (status === 'SHIPPED' && trackingNumber) {
      updateData.trackingNumber = trackingNumber
      updateData.shippingCompany = shippingCompany
      updateData.shippedAt = new Date()
      
      // 创建物流跟踪记录
      await prisma.trackingHistory.create({
        data: {
          orderId,
          status: 'SHIPPED',
          description: `订单已发货，物流公司：${shippingCompany}，运单号：${trackingNumber}`,
          timestamp: new Date()
        }
      })
    }

    // 如果是送达状态，记录送达时间
    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
      
      // 创建物流跟踪记录
      await prisma.trackingHistory.create({
        data: {
          orderId,
          status: 'DELIVERED',
          description: '订单已送达',
          timestamp: new Date()
        }
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        }
      }
    })

    // 如果订单状态变为已发货，可以发送通知（需要实现通知系统）
    if (status === 'SHIPPED') {
      // await sendOrderShippedNotification(updatedOrder)
      console.log(`订单 ${orderId} 已发货，用户: ${updatedOrder.user.email}`)
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: '订单状态更新成功'
    })
  } catch (error) {
    console.error('更新订单状态失败:', error)
    return NextResponse.json(
      { success: false, error: '更新订单状态失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - 删除订单（仅管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const orderId = params.id

    // 验证订单是否存在
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: '订单不存在' },
        { status: 404 }
      )
    }

    // 只允许删除已取消或已退款的订单
    if (!['CANCELLED', 'REFUNDED'].includes(existingOrder.status)) {
      return NextResponse.json(
        { success: false, error: '只能删除已取消或已退款的订单' },
        { status: 400 }
      )
    }

    // 删除订单（级联删除订单项）
    await prisma.order.delete({
      where: { id: orderId }
    })

    return NextResponse.json({
      success: true,
      message: '订单删除成功'
    })
  } catch (error) {
    console.error('删除订单失败:', error)
    return NextResponse.json(
      { success: false, error: '删除订单失败' },
      { status: 500 }
    )
  }
}