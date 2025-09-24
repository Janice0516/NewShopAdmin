import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/orders/[id]/tracking - 获取订单物流跟踪信息
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

    // 获取订单基本信息
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNo: true,
        status: true,
        trackingNumber: true,
        shippingCompany: true,
        shippedAt: true,
        deliveredAt: true,
        estimatedDelivery: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
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

    // 权限检查：只有订单所有者或管理员可以查看
    if (user.role !== 'ADMIN' && order.user.id !== user.userId) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    // 获取物流跟踪历史
    const trackingHistory = await prisma.trackingHistory.findMany({
      where: { orderId },
      orderBy: { timestamp: 'desc' }
    })

    // 如果有物流单号，可以调用第三方物流API获取实时信息
    let externalTracking = null
    if (order.trackingNumber && order.shippingCompany) {
      // 这里可以集成第三方物流API
      // externalTracking = await getExternalTrackingInfo(order.trackingNumber, order.shippingCompany)
    }

    return NextResponse.json({
      success: true,
      data: {
        order: {
          id: order.id,
          orderNo: order.orderNo,
          status: order.status,
          trackingNumber: order.trackingNumber,
          shippingCompany: order.shippingCompany,
          shippedAt: order.shippedAt,
          deliveredAt: order.deliveredAt,
          estimatedDelivery: order.estimatedDelivery
        },
        trackingHistory,
        externalTracking
      }
    })
  } catch (error) {
    console.error('获取物流跟踪信息失败:', error)
    return NextResponse.json(
      { success: false, error: '获取物流跟踪信息失败' },
      { status: 500 }
    )
  }
}

// POST /api/orders/[id]/tracking - 添加物流跟踪记录（管理员）
export async function POST(
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
    const { status, description, location, timestamp } = body

    if (!status || !description) {
      return NextResponse.json(
        { success: false, error: '状态和描述不能为空' },
        { status: 400 }
      )
    }

    // 验证订单是否存在
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: '订单不存在' },
        { status: 404 }
      )
    }

    // 创建物流跟踪记录
    const trackingRecord = await prisma.trackingHistory.create({
      data: {
        orderId,
        status,
        description,
        location,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: trackingRecord,
      message: '物流跟踪记录添加成功'
    })
  } catch (error) {
    console.error('添加物流跟踪记录失败:', error)
    return NextResponse.json(
      { success: false, error: '添加物流跟踪记录失败' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id]/tracking - 更新订单物流信息（管理员）
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
    const { trackingNumber, shippingCompany, estimatedDelivery } = body

    // 验证订单是否存在
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: '订单不存在' },
        { status: 404 }
      )
    }

    // 更新订单物流信息
    const updateData: any = {}
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber
    if (shippingCompany !== undefined) updateData.shippingCompany = shippingCompany
    if (estimatedDelivery !== undefined) updateData.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : null

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData
    })

    // 如果更新了物流单号，添加跟踪记录
    if (trackingNumber && trackingNumber !== order.trackingNumber) {
      await prisma.trackingHistory.create({
        data: {
          orderId,
          status: 'TRACKING_UPDATED',
          description: `物流单号已更新：${trackingNumber}`,
          timestamp: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: '物流信息更新成功'
    })
  } catch (error) {
    console.error('更新物流信息失败:', error)
    return NextResponse.json(
      { success: false, error: '更新物流信息失败' },
      { status: 500 }
    )
  }
}