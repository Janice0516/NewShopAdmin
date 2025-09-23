import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

// POST /api/payments/refund - 申请退款
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }

    const { orderId, amount, reason } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: '订单ID不能为空' },
        { status: 400 }
      )
    }

    // 查找订单
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: (session.user as any).id
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: '订单不存在或无权限访问' },
        { status: 404 }
      )
    }

    // 检查订单状态
    if (!['PAID', 'SHIPPED', 'DELIVERED'].includes(order.status)) {
      return NextResponse.json(
        { success: false, error: '订单状态不允许退款' },
        { status: 400 }
      )
    }

    // 计算退款金额
    const refundAmount = amount || Number(order.totalAmount)

    if (refundAmount <= 0 || refundAmount > Number(order.totalAmount)) {
      return NextResponse.json(
        { success: false, error: '退款金额无效' },
        { status: 400 }
      )
    }

    // 生成退款流水号
    const refundNumber = `RF${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // 模拟退款处理
    const refundResult = {
      status: 'completed',
      refundNumber,
      amount: refundAmount
    }

    // 更新订单状态
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'REFUNDED' }
    })

    return NextResponse.json({
      success: true,
      data: {
        refundNumber,
        status: refundResult.status,
        amount: refundAmount
      }
    })
  } catch (error) {
    console.error('申请退款失败:', error)
    return NextResponse.json(
      { success: false, error: '申请退款失败' },
      { status: 500 }
    )
  }
}

// GET /api/payments/refund - 查询退款记录
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: '订单ID不能为空' },
        { status: 400 }
      )
    }

    // 查找订单
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: (session.user as any).id
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: '订单不存在或无权限访问' },
        { status: 404 }
      )
    }

    // 返回退款信息（基于订单状态）
    const refundInfo = order.status === 'REFUNDED' ? {
      refundNumber: `RF${order.id}`,
      status: 'completed',
      amount: Number(order.totalAmount),
      refundedAt: order.updatedAt
    } : null

    return NextResponse.json({
      success: true,
      data: refundInfo
    })
  } catch (error) {
    console.error('查询退款记录失败:', error)
    return NextResponse.json(
      { success: false, error: '查询退款记录失败' },
      { status: 500 }
    )
  }
}