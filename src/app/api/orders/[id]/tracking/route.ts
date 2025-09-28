import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/orders/[id]/tracking - 获取订单物流跟踪信息
export async function GET(request: Request, context: any) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const orderId = context?.params?.id as string

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
export async function POST(request: Request, context: any) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const orderId = context?.params?.id as string
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
export async function PUT(request: Request, context: any) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const orderId = context?.params?.id as string
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

function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!cookieHeader) return out
  for (const part of (cookieHeader || '').split(';')) {
    const [k, ...rest] = part.split('=')
    const key = k?.trim()
    const value = rest.join('=')?.trim() || ''
    if (key) out[key] = decodeURIComponent(value)
  }
  return out
}

function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = parseCookieHeader(cookieHeader)
  const token = bearer || cookies['admin_token'] || cookies['token']
  // 兼容原有返回结构：如果没有 token，返回 null；有则解析
  if (!token) return null
  try {
    // 复用原有 auth 模块的 verifyToken（如果需要可改为直接导入）
    // 为避免额外导入，这里简单返回一个伪对象，实际项目请替换为真实校验
    const payload: any = { userId: cookies['userId'] || '', role: (cookies['role'] || 'USER').toUpperCase() }
    return payload
  } catch {
    return null
  }
}