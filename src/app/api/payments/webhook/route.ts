import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// POST /api/payments/webhook - 处理支付回调通知
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider') // alipay, wechat, stripe

    if (!provider) {
      return NextResponse.json(
        { success: false, error: '缺少支付提供商参数' },
        { status: 400 }
      )
    }

    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    let paymentResult
    switch (provider) {
      case 'alipay':
        paymentResult = await handleAlipayWebhook(body, headers)
        break
      case 'wechat':
        paymentResult = await handleWechatWebhook(body, headers)
        break
      case 'stripe':
        paymentResult = await handleStripeWebhook(body, headers)
        break
      default:
        return NextResponse.json(
          { success: false, error: '不支持的支付提供商' },
          { status: 400 }
        )
    }

    if (!paymentResult) {
      return NextResponse.json(
        { success: false, error: '处理支付回调失败' },
        { status: 400 }
      )
    }

    // 更新支付记录
    await updatePaymentStatus(paymentResult)

    // 返回成功响应（根据不同支付平台要求的格式）
    switch (provider) {
      case 'alipay':
        return new Response('success', { status: 200 })
      case 'wechat':
        return NextResponse.json({ code: 'SUCCESS', message: '成功' })
      case 'stripe':
        return NextResponse.json({ received: true })
      default:
        return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('处理支付回调失败:', error)
    return NextResponse.json(
      { success: false, error: '处理支付回调失败' },
      { status: 500 }
    )
  }
}

// 处理支付宝回调
async function handleAlipayWebhook(body: string, headers: any) {
  try {
    // 解析支付宝回调参数
    const params = new URLSearchParams(body)
    const data: any = {}
    for (const [key, value] of params) {
      data[key] = value
    }

    // 验证签名（实际项目中需要使用支付宝公钥验证）
    const isValidSignature = verifyAlipaySignature(data)
    if (!isValidSignature) {
      console.error('支付宝回调签名验证失败')
      return null
    }

    // 提取关键信息
    const {
      out_trade_no: paymentNumber,
      trade_no: thirdPartyTransactionId,
      trade_status: tradeStatus,
      total_amount: amount,
      gmt_payment: paymentTime
    } = data

    // 转换支付状态
    let status = 'failed'
    if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
      status = 'completed'
    } else if (tradeStatus === 'WAIT_BUYER_PAY') {
      status = 'processing'
    }

    return {
      paymentNumber,
      thirdPartyTransactionId,
      status,
      amount: parseFloat(amount),
      paymentTime: paymentTime ? new Date(paymentTime) : new Date(),
      rawData: data
    }
  } catch (error) {
    console.error('处理支付宝回调失败:', error)
    return null
  }
}

// 处理微信支付回调
async function handleWechatWebhook(body: string, headers: any) {
  try {
    // 解析微信支付回调数据（XML格式）
    const data = parseWechatXML(body)

    // 验证签名（实际项目中需要使用微信支付密钥验证）
    const isValidSignature = verifyWechatSignature(data, headers)
    if (!isValidSignature) {
      console.error('微信支付回调签名验证失败')
      return null
    }

    // 提取关键信息
    const {
      out_trade_no: paymentNumber,
      transaction_id: thirdPartyTransactionId,
      result_code: resultCode,
      total_fee: totalFee,
      time_end: timeEnd
    } = data

    // 转换支付状态
    let status = 'failed'
    if (resultCode === 'SUCCESS') {
      status = 'completed'
    }

    return {
      paymentNumber,
      thirdPartyTransactionId,
      status,
      amount: parseInt(totalFee) / 100, // 微信支付金额单位为分
      paymentTime: timeEnd ? parseWechatTime(timeEnd) : new Date(),
      rawData: data
    }
  } catch (error) {
    console.error('处理微信支付回调失败:', error)
    return null
  }
}

// 处理Stripe回调
async function handleStripeWebhook(body: string, headers: any) {
  try {
    // 验证Stripe签名
    const signature = headers['stripe-signature']
    const isValidSignature = verifyStripeSignature(body, signature)
    if (!isValidSignature) {
      console.error('Stripe回调签名验证失败')
      return null
    }

    // 解析Stripe事件
    const event = JSON.parse(body)
    
    if (event.type !== 'payment_intent.succeeded') {
      console.log('忽略非支付成功事件:', event.type)
      return null
    }

    const paymentIntent = event.data.object

    // 从metadata中获取支付流水号
    const paymentNumber = paymentIntent.metadata?.paymentNumber

    if (!paymentNumber) {
      console.error('Stripe回调中缺少支付流水号')
      return null
    }

    return {
      paymentNumber,
      thirdPartyTransactionId: paymentIntent.id,
      status: 'completed',
      amount: paymentIntent.amount / 100, // Stripe金额单位为分
      paymentTime: new Date(paymentIntent.created * 1000),
      rawData: event
    }
  } catch (error) {
    console.error('处理Stripe回调失败:', error)
    return null
  }
}

// 更新支付状态
async function updatePaymentStatus(paymentResult: any) {
  try {
    // 临时处理：通过paymentId查找订单而不是支付记录
    const order = await prisma.order.findFirst({
      where: {
        paymentId: paymentResult.paymentNumber
      }
    })

    if (!order) {
      console.error('未找到订单记录:', paymentResult.paymentNumber)
      return
    }

    // 防止重复处理
    if (order.status === 'PAID') {
      console.log('订单已支付，跳过处理:', paymentResult.paymentNumber)
      return
    }

    // 如果支付成功，更新订单状态
    if (paymentResult.status === 'completed') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID'
          // paidAt: paymentResult.paymentTime || new Date() // 注意：Order模型中没有paidAt字段
        }
      })

      // 处理订单后续逻辑（如库存扣减、发货等）
      await processOrderAfterPayment(order)
    }

    console.log('订单状态更新成功:', paymentResult.paymentNumber, paymentResult.status)
  } catch (error) {
    console.error('更新支付状态失败:', error)
    throw error
  }
}

// 订单支付后处理
async function processOrderAfterPayment(order: any) {
  try {
    // 扣减商品库存
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
      include: { product: true }
    })

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

    // 如果使用了优惠券，标记为已使用
    if (order.couponId) {
      await prisma.userCoupon.updateMany({
        where: {
          userId: order.userId,
          couponId: order.couponId,
          status: 'UNUSED'
        },
        data: {
          status: 'USED',
          usedAt: new Date()
        }
      })
    }

    // 增加用户积分 - 注意：User模型中没有points字段，需要通过其他方式处理
    const pointsEarned = Math.floor(order.totalAmount * 0.01) // 1%返积分
    if (pointsEarned > 0) {
      // await prisma.user.update({
      //   where: { id: order.userId },
      //   data: {
      //     points: {
      //       increment: pointsEarned
      //     }
      //   }
      // })

      // await prisma.pointsHistory.create({
      //   data: {
      //     userId: order.userId,
      //     amount: pointsEarned,
      //     type: 'earn',
      //     source: 'order',
      //     sourceId: order.id,
      //     description: `订单消费获得积分: ${order.orderNumber}`
      //   }
      // })
    }

    console.log('订单支付后处理完成:', order.orderNumber)
  } catch (error) {
    console.error('订单支付后处理失败:', error)
    // 这里可以记录错误日志，但不抛出异常，避免影响支付回调处理
  }
}

// 验证支付宝签名（示例实现）
function verifyAlipaySignature(data: any): boolean {
  // 实际项目中需要使用支付宝提供的SDK进行签名验证
  // 这里只是示例代码
  return true
}

// 验证微信支付签名（示例实现）
function verifyWechatSignature(data: any, headers: any): boolean {
  // 实际项目中需要使用微信支付提供的SDK进行签名验证
  // 这里只是示例代码
  return true
}

// 验证Stripe签名（示例实现）
function verifyStripeSignature(body: string, signature: string): boolean {
  // 实际项目中需要使用Stripe提供的SDK进行签名验证
  // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  // return stripe.webhooks.constructEvent(body, signature, endpointSecret)
  return true
}

// 解析微信支付XML（示例实现）
function parseWechatXML(xml: string): any {
  // 实际项目中需要使用XML解析库
  // 这里只是示例代码
  return {}
}

// 解析微信支付时间格式
function parseWechatTime(timeStr: string): Date {
  // 微信支付时间格式：20220101120000
  const year = parseInt(timeStr.substr(0, 4))
  const month = parseInt(timeStr.substr(4, 2)) - 1
  const day = parseInt(timeStr.substr(6, 2))
  const hour = parseInt(timeStr.substr(8, 2))
  const minute = parseInt(timeStr.substr(10, 2))
  const second = parseInt(timeStr.substr(12, 2))
  
  return new Date(year, month, day, hour, minute, second)
}