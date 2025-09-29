import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken, type JWTPayload } from '@/lib/auth'

const prisma = new PrismaClient()

function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!cookieHeader) return out
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.split('=')
    const key = k?.trim()
    const value = rest.join('=').trim()
    if (key) out[key] = decodeURIComponent(value || '')
  }
  return out
}

function getUserFromRequest(request: Request): JWTPayload | null {
  const authHeader = request.headers.get('authorization') || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = parseCookieHeader(cookieHeader)
  const token = bearer || cookies['admin_token'] || cookies['token']
  if (!token) return null
  return verifyToken(token)
}

// GET /api/orders/[id] - 获取订单详情
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

    const where: any = { id: orderId }
    if (user.role !== 'ADMIN') {
      where.userId = user.userId
    }

    const order = await prisma.order.findUnique({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        address: true,
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, price: true, description: true } }
          }
        },
        coupons: {
          include: {
            coupon: { select: { id: true, name: true, code: true, type: true, value: true } }
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

    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    console.error('获取订单详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取订单详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - 更新订单状态
export async function PUT(request: Request, context: any) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: '权限不足' }, { status: 403 })
    }

    const orderId = context?.params?.id as string
    const body = await request.json()
    const { status, remark, trackingNumber, shippingCompany } = body

    if (!status) {
      return NextResponse.json({ success: false, error: '请选择订单状态' }, { status: 400 })
    }

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } })
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: '订单不存在' }, { status: 404 })
    }

    const updateData: any = { status, updatedAt: new Date() }
    if (remark !== undefined) updateData.remark = remark

    if (status === 'SHIPPED' && trackingNumber) {
      updateData.trackingNumber = trackingNumber
      updateData.shippingCompany = shippingCompany
      updateData.shippedAt = new Date()
      await prisma.trackingHistory.create({
        data: {
          orderId,
          status: 'SHIPPED',
          description: `订单已发货，物流公司：${shippingCompany}，运单号：${trackingNumber}`,
          timestamp: new Date()
        }
      })
    }

    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
      await prisma.trackingHistory.create({
        data: { orderId, status: 'DELIVERED', description: '订单已送达', timestamp: new Date() }
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { id: true, name: true, images: true } } } }
      }
    })

    if (status === 'SHIPPED') {
      // 移除敏感日志：不再输出用户邮箱
      console.info('订单已发货', { orderId })
    }

    return NextResponse.json({ success: true, data: updatedOrder, message: '订单状态更新成功' })
  } catch (error) {
    // 统一错误日志为非敏感输出
    console.error('更新订单状态失败')
    return NextResponse.json({ success: false, error: '更新订单状态失败' }, { status: 500 })
  }
}

// DELETE /api/orders/[id] - 删除订单（仅管理员）
export async function DELETE(request: Request, context: any) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: '权限不足' }, { status: 403 })
    }

    const orderId = context?.params?.id as string

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: '订单不存在' }, { status: 404 })
    }

    if (!['CANCELLED', 'REFUNDED'].includes(existingOrder.status)) {
      return NextResponse.json({ success: false, error: '只能删除已取消或已退款的订单' }, { status: 400 })
    }

    await prisma.order.delete({ where: { id: orderId } })

    return NextResponse.json({ success: true, message: '订单删除成功' })
  } catch (error) {
    // 统一错误日志为非敏感输出
    console.error('删除订单失败')
    return NextResponse.json({ success: false, error: '删除订单失败' }, { status: 500 })
  }
}