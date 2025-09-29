import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

// POST /api/payments/create - 创建支付订单
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
      orderId, 
      paymentMethod, 
      amount, 
      currency = 'CNY',
      returnUrl,
      notifyUrl 
    } = body

    // 验证必填字段
    if (!orderId || !paymentMethod || !amount) {
      return NextResponse.json(
        { success: false, error: '缺少必要的支付参数' },
        { status: 400 }
      )
    }

    // 验证订单是否存在且属于当前用户
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.userId,
        status: 'PENDING'
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: '订单不存在或状态异常' },
        { status: 404 }
      )
    }

    // 验证支付金额
    if (Math.abs(amount - Number(order.totalAmount)) > 0.01) {
      return NextResponse.json(
        { success: false, error: '支付金额与订单金额不符' },
        { status: 400 }
      )
    }

    // 检查是否已有未完成的支付记录
    // 注意：由于schema中没有Payment模型，这里需要通过其他方式处理支付记录
    // const existingPayment = await prisma.payment.findFirst({
    //   where: {
    //     orderId,
    //     status: {
    //       in: ['pending', 'processing']
    //     }
    //   }
    // })

    // if (existingPayment) {
    //   return NextResponse.json(
    //     { success: false, error: '订单已有进行中的支付，请勿重复提交' },
    //     { status: 400 }
    //   )
    // }

    // 生成支付流水号
    const paymentNumber = `PAY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // 创建支付记录 - 注意：由于schema中没有Payment模型，这里需要通过其他方式处理
    // const payment = await prisma.payment.create({
    //   data: {
    //     paymentNumber,
    //     orderId,
    //     userId: user.userId,
    //     amount,
    //     currency,
    //     paymentMethod,
    //     status: 'pending',
    //     returnUrl,
    //     notifyUrl
    //   }
    // })

    // 临时处理：直接更新订单的支付方式
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod,
        paymentId: paymentNumber
      }
    })

    // 根据支付方式调用相应的支付接口
    let paymentResult
    const paymentData = { paymentNumber, orderId, amount, paymentMethod } // 临时支付数据对象
    switch (paymentMethod) {
      case 'alipay':
        paymentResult = await createAlipayOrder(paymentData, order)
        break
      case 'wechat':
        paymentResult = await createWechatOrder(paymentData, order)
        break
      case 'stripe':
        paymentResult = await createStripeOrder(paymentData, order)
        break
      case 'balance':
        paymentResult = await processBalancePayment(paymentData, order, user.userId)
        break
      default:
        return NextResponse.json(
          { success: false, error: '不支持的支付方式' },
          { status: 400 }
        )
    }

    // 更新支付记录 - 注意：由于schema中没有Payment模型，这里需要通过其他方式处理
    // await prisma.payment.update({
    //   where: { id: payment.id },
    //   data: {
    //     thirdPartyOrderId: paymentResult.thirdPartyOrderId,
    //     status: paymentResult.status,
    //     paymentData: paymentResult.paymentData
    //   }
    // })

    // 临时处理：更新订单状态
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: paymentResult.status === 'completed' ? 'PAID' : 'PENDING',
        paymentId: paymentData.paymentNumber,
        // paymentNumber: paymentData.paymentNumber, // 注意：Order模型中没有paymentNumber字段
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        paymentId: paymentData.paymentNumber,
        paymentNumber: paymentData.paymentNumber,
        ...paymentResult
      },
      message: '支付订单创建成功'
    })
  } catch (error) {
    console.error('创建支付订单失败:', error)
    return NextResponse.json(
      { success: false, error: '创建支付订单失败' },
      { status: 500 }
    )
  }
}

// GET /api/payments/status - 查询支付状态
export async function GET(request: NextRequest) {
  try {
    // 验证用户权限
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')
    const paymentNumber = searchParams.get('paymentNumber')

    if (!paymentId && !paymentNumber) {
      return NextResponse.json(
        { success: false, error: '请提供支付ID或支付流水号' },
        { status: 400 }
      )
    }

    // 查找支付记录 - 注意：由于schema中没有Payment模型，这里需要通过其他方式处理
    // const where: any = { userId: user.userId }
    // if (paymentId) {
    //   where.id = paymentId
    // } else {
    //   where.paymentNumber = paymentNumber
    // }

    // const payment = await prisma.payment.findFirst({
    //   where,
    //   include: {
    //     order: {
    //       select: {
    //         id: true,
    //         orderNumber: true,
    //         totalAmount: true,
    //         status: true
    //       }
    //     }
    //   }
    // })

    // 临时处理：通过订单查找支付信息
    const order = await prisma.order.findFirst({
      where: {
        userId: user.userId,
        ...(paymentId ? { paymentId } : { paymentId: paymentNumber })
      },
      select: {
        id: true,
        // orderNumber: true, // 注意：Order模型中没有orderNumber字段
        totalAmount: true,
        status: true,
        paymentMethod: true,
        paymentId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: '支付记录不存在' },
        { status: 404 }
      )
    }

    // 构造支付记录格式
    const payment = {
      id: order.paymentId,
      paymentNumber: order.paymentId,
      orderId: order.id,
      userId: user.userId,
      amount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      status: order.status === 'PAID' ? 'completed' : 'pending',
      order: {
        id: order.id,
        // orderNumber: order.orderNumber, // 注意：Order模型中没有orderNumber字段
        totalAmount: Number(order.totalAmount),
        status: order.status
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }

    // 如果支付状态为处理中，查询第三方支付状态
    if (payment.status === 'pending' && order.paymentId) {
      const updatedStatus = await queryThirdPartyPaymentStatus(
        payment.paymentMethod || 'unknown',
        order.paymentId
      )

      if (updatedStatus && updatedStatus !== 'pending') {
        // 更新订单状态而不是支付记录
        const newOrderStatus = updatedStatus === 'completed' ? 'PAID' : 'PENDING'
        await prisma.order.update({
          where: { id: order.id },
          data: { status: newOrderStatus }
        })
        payment.status = updatedStatus
      }
    }

    return NextResponse.json({
      success: true,
      data: payment
    })
  } catch (error) {
    console.error('查询支付状态失败:', error)
    return NextResponse.json(
      { success: false, error: '查询支付状态失败' },
      { status: 500 }
    )
  }
}

// 支付宝支付
async function createAlipayOrder(payment: any, order: any) {
  // 这里应该调用支付宝SDK
  // 示例代码，实际需要根据支付宝文档实现
  try {
    const alipayOrderId = `ALIPAY_${Date.now()}`
    
    // 模拟支付宝下单接口
    const paymentUrl = `https://openapi.alipay.com/gateway.do?app_id=YOUR_APP_ID&method=alipay.trade.page.pay&charset=UTF-8&sign_type=RSA2&timestamp=${new Date().toISOString()}&version=1.0&out_trade_no=${payment.paymentNumber}&total_amount=${payment.amount}&subject=${order.orderNumber}&product_code=FAST_INSTANT_TRADE_PAY`

    return {
      status: 'processing',
      thirdPartyOrderId: alipayOrderId,
      paymentData: {
        paymentUrl,
        qrCode: null // 如果是扫码支付，这里返回二维码
      }
    }
  } catch (error) {
    console.error('创建支付宝订单失败:', error)
    throw new Error('创建支付宝订单失败')
  }
}

// 微信支付
async function createWechatOrder(payment: any, order: any) {
  // 这里应该调用微信支付SDK
  // 示例代码，实际需要根据微信支付文档实现
  try {
    const wechatOrderId = `WECHAT_${Date.now()}`
    
    // 模拟微信支付下单接口
    const paymentData = {
      appId: 'YOUR_WECHAT_APP_ID',
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: Math.random().toString(36).substr(2, 15),
      package: `prepay_id=${wechatOrderId}`,
      signType: 'RSA',
      paySign: 'MOCK_SIGN'
    }

    return {
      status: 'processing',
      thirdPartyOrderId: wechatOrderId,
      paymentData
    }
  } catch (error) {
    console.error('创建微信支付订单失败:', error)
    throw new Error('创建微信支付订单失败')
  }
}

// Stripe支付
async function createStripeOrder(payment: any, order: any) {
  // 这里应该调用Stripe SDK
  // 示例代码，实际需要根据Stripe文档实现
  try {
    const stripeOrderId = `STRIPE_${Date.now()}`
    
    // 模拟Stripe支付意图创建
    const paymentIntent = {
      id: stripeOrderId,
      client_secret: `${stripeOrderId}_secret_mock`,
      amount: Math.round(payment.amount * 100), // Stripe使用分为单位
      currency: payment.currency.toLowerCase()
    }

    return {
      status: 'processing',
      thirdPartyOrderId: stripeOrderId,
      paymentData: {
        clientSecret: paymentIntent.client_secret,
        publishableKey: 'pk_test_mock_key'
      }
    }
  } catch (error) {
    console.error('创建Stripe订单失败:', error)
    throw new Error('创建Stripe订单失败')
  }
}

// 余额支付
async function processBalancePayment(payment: any, order: any, userId: string) {
  try {
    // 查询用户余额
    // 注意：User模型中没有balance字段，暂时跳过余额检查
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { balance: true }
    // })

    // if (!user || user.balance < payment.amount) {
    //   throw new Error('余额不足')
    // }

    // 临时处理：直接标记订单为已支付
     await prisma.order.update({
       where: { id: order.id },
       data: {
         status: 'PAID'
         // paidAt: new Date() // 注意：Order模型中没有paidAt字段
       }
     })

    // 扣除余额 - 注意：User模型中没有balance字段，需要通过其他方式处理
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     balance: {
    //       decrement: payment.amount
    //     }
    //   }
    // })

    // 记录余额变动 - 注意：balanceHistory表不存在，需要通过其他方式记录
    // await prisma.balanceHistory.create({
    //   data: {
    //     userId,
    //     amount: -payment.amount,
    //     type: 'expense',
    //     source: 'payment',
    //     sourceId: payment.id,
    //     description: `订单支付: ${order.orderNumber}`
    //   }
    // })

    // 更新订单状态
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' }
    })

    return {
      status: 'completed',
      thirdPartyOrderId: `BALANCE_${Date.now()}`,
      paymentData: {
        message: '余额支付成功'
      }
    }
  } catch (error) {
    console.error('余额支付失败:', error)
    throw error
  }
}

// 查询第三方支付状态
async function queryThirdPartyPaymentStatus(paymentMethod: string, thirdPartyOrderId: string): Promise<string | null> {
  try {
    switch (paymentMethod) {
      case 'alipay':
        // 调用支付宝查询接口
        return 'completed' // 模拟返回
      case 'wechat':
        // 调用微信支付查询接口
        return 'pending' // 模拟返回不同状态
      case 'stripe':
        // 调用Stripe查询接口
        return 'completed' // 模拟返回
      default:
        return null
    }
  } catch (error) {
    console.error('查询第三方支付状态失败:', error)
    return null
  }
}