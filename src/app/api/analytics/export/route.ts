import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const format = searchParams.get('format') || 'excel'

    // 构建日期过滤条件
    const dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate + 'T23:59:59.999Z')
      }
    }

    // 获取分析数据
    const [
      // 概览数据
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      
      // 订单数据
      orders,
      ordersByStatus,
      
      // 用户数据
      topCustomers,
      
      // 产品数据
      topProducts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { totalAmount: true }
      }),
      
      // 详细订单数据
      prisma.order.findMany({
        where: dateFilter,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // 订单状态统计
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { totalAmount: true }
      }),
      
      // 优质客户
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          orders: {
            where: { status: 'DELIVERED' },
            select: {
              totalAmount: true
            }
          }
        },
        take: 50
      }),
      
      // 热销产品
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: dateFilter
        },
        _sum: {
          quantity: true,
          price: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 50
      })
    ])

    // 处理客户数据
    const customersWithSpending = topCustomers.map(customer => ({
      ...customer,
      totalSpent: customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
      orderCount: customer.orders.length
    })).sort((a, b) => b.totalSpent - a.totalSpent)

    // 获取产品详情
    const productIds = topProducts.map(item => item.productId)
    const productDetails = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, category: true }
    })

    const productMap = productDetails.reduce((acc: any, product) => {
      acc[product.id] = product
      return acc
    }, {})

    const productsWithDetails = topProducts.map(item => ({
      name: productMap[item.productId]?.name || '未知产品',
      category: productMap[item.productId]?.category || '未分类',
      soldQuantity: item._sum.quantity || 0,
      revenue: Number(item._sum.price || 0),
      unitPrice: Number(productMap[item.productId]?.price || 0)
    }))

    if (format === 'excel') {
      // 创建Excel工作簿
      const workbook = XLSX.utils.book_new()

      // 概览数据工作表
      const overviewData = [
        ['指标', '数值'],
        ['总用户数', totalUsers],
        ['总产品数', totalProducts],
        ['总订单数', totalOrders],
        ['总收入', Number(totalRevenue._sum.totalAmount || 0)],
        ['报表生成时间', new Date().toLocaleString('zh-CN')]
      ]
      const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData)
      XLSX.utils.book_append_sheet(workbook, overviewSheet, '概览')

      // 订单状态统计工作表
      const statusData = [
        ['订单状态', '数量', '金额'],
        ...ordersByStatus.map(item => [
          item.status === 'PENDING' ? '待付款' :
          item.status === 'PAID' ? '已付款' :
          item.status === 'SHIPPED' ? '已发货' :
          item.status === 'DELIVERED' ? '已送达' :
          item.status === 'CANCELLED' ? '已取消' :
          item.status === 'REFUNDED' ? '已退款' : item.status,
          item._count.id,
          Number(item._sum.totalAmount || 0)
        ])
      ]
      const statusSheet = XLSX.utils.aoa_to_sheet(statusData)
      XLSX.utils.book_append_sheet(workbook, statusSheet, '订单状态')

      // 订单详情工作表
      const orderData = [
        ['订单号', '客户姓名', '客户邮箱', '订单状态', '订单金额', '创建时间', '支付方式'],
        ...orders.map(order => [
          order.orderNo,
          order.user?.name || '未知',
          order.user?.email || '未知',
          order.status === 'PENDING' ? '待付款' :
          order.status === 'PAID' ? '已付款' :
          order.status === 'SHIPPED' ? '已发货' :
          order.status === 'DELIVERED' ? '已送达' :
          order.status === 'CANCELLED' ? '已取消' :
          order.status === 'REFUNDED' ? '已退款' : order.status,
          Number(order.totalAmount),
          order.createdAt.toLocaleString('zh-CN'),
          order.paymentMethod || '未知'
        ])
      ]
      const orderSheet = XLSX.utils.aoa_to_sheet(orderData)
      XLSX.utils.book_append_sheet(workbook, orderSheet, '订单详情')

      // 优质客户工作表
      const customerData = [
        ['客户姓名', '邮箱', '注册时间', '订单数量', '总消费金额'],
        ...customersWithSpending.slice(0, 100).map(customer => [
          customer.name,
          customer.email,
          customer.createdAt.toLocaleString('zh-CN'),
          customer.orderCount,
          customer.totalSpent
        ])
      ]
      const customerSheet = XLSX.utils.aoa_to_sheet(customerData)
      XLSX.utils.book_append_sheet(workbook, customerSheet, '优质客户')

      // 热销产品工作表
      const productData = [
        ['产品名称', '分类', '销售数量', '销售收入', '单价'],
        ...productsWithDetails.map(product => [
          product.name,
          product.category,
          product.soldQuantity,
          product.revenue,
          product.unitPrice
        ])
      ]
      const productSheet = XLSX.utils.aoa_to_sheet(productData)
      XLSX.utils.book_append_sheet(workbook, productSheet, '热销产品')

      // 生成Excel文件
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'buffer',
        compression: true
      })

      const fileName = `analytics-report-${startDate || 'all'}-${endDate || 'all'}.xlsx`

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': excelBuffer.length.toString()
        }
      })
    }

    // 默认返回JSON格式
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue._sum.totalAmount || 0
        },
        orders: orders.slice(0, 1000), // 限制返回数量
        ordersByStatus,
        topCustomers: customersWithSpending.slice(0, 50),
        topProducts: productsWithDetails
      }
    })

  } catch (error) {
    console.error('导出分析报表失败:', error)
    return NextResponse.json(
      { success: false, error: '导出分析报表失败' },
      { status: 500 }
    )
  }
}