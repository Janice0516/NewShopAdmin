import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/analytics - 获取数据统计分析
export async function GET(request: NextRequest) {
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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type') || 'overview'

    // 设置默认时间范围（最近30天）
    const defaultEndDate = new Date()
    const defaultStartDate = new Date()
    defaultStartDate.setDate(defaultStartDate.getDate() - 30)

    const dateFilter = {
      createdAt: {
        gte: startDate ? new Date(startDate) : defaultStartDate,
        lte: endDate ? new Date(endDate) : defaultEndDate
      }
    }

    let analyticsData: any = {}

    if (type === 'overview' || type === 'all') {
      // 总体概览数据
      const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        activeUsers,
        newUsers,
        completedOrders,
        pendingOrders
      ] = await Promise.all([
        // 总用户数
        prisma.user.count(),
        // 总商品数
        prisma.product.count(),
        // 总订单数
        prisma.order.count(),
        // 总收入
        prisma.order.aggregate({
          where: { status: 'DELIVERED' },
          _sum: { totalAmount: true }
        }),
        // 活跃用户（最近30天有订单的用户）
        prisma.user.count({
          where: {
            orders: {
              some: dateFilter
            }
          }
        }),
        // 新用户
        prisma.user.count({
          where: dateFilter
        }),
        // 已完成订单
        prisma.order.count({
          where: {
            ...dateFilter,
            status: 'DELIVERED'
          }
        }),
        // 待处理订单
        prisma.order.count({
          where: {
            status: { in: ['PENDING', 'PAID'] }
          }
        })
      ])

      analyticsData.overview = {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        activeUsers,
        newUsers,
        completedOrders,
        pendingOrders
      }
    }

    if (type === 'sales' || type === 'all') {
      // 销售数据分析
      const salesByDay = await prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          ...dateFilter,
          status: 'DELIVERED'
        },
        _sum: {
          totalAmount: true
        },
        _count: {
          id: true
        }
      })

      const salesByCategory = await prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            ...dateFilter,
            status: 'DELIVERED'
          }
        },
        _sum: {
          quantity: true,
          price: true
        },
        _count: {
          id: true
        }
      })

      // 获取商品分类信息
      const productCategories = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          category: true
        }
      })

      const categoryMap = productCategories.reduce((acc: any, product: any) => {
        acc[product.id] = product.category
        return acc
      }, {})

      const categorySales = salesByCategory.reduce((acc: any, item: any) => {
        const category = categoryMap[item.productId] || '其他'
        if (!acc[category]) {
          acc[category] = {
            quantity: 0,
            revenue: 0,
            orders: 0
          }
        }
        acc[category].quantity += item._sum.quantity || 0
        acc[category].revenue += item._sum.price || 0
        acc[category].orders += item._count.id || 0
        return acc
      }, {})

      // 计算总收入用于百分比计算
      const totalCategoryRevenue = Object.values(categorySales).reduce((sum: number, data: any) => sum + data.revenue, 0)

      analyticsData.sales = {
        dailySales: salesByDay.map((item: any) => ({
          date: item.createdAt.toISOString().split('T')[0],
          amount: item._sum.totalAmount || 0,
          orders: item._count.id || 0
        })),
        categorySales: Object.entries(categorySales).map(([category, data]: [string, any]) => ({
          category,
          amount: data.revenue,
          percentage: totalCategoryRevenue > 0 ? (data.revenue / totalCategoryRevenue) * 100 : 0
        })),
        monthlyTrend: salesByDay.map((item: any) => ({
          month: item.createdAt.toISOString().split('T')[0],
          revenue: item._sum.totalAmount || 0,
          orders: item._count.id || 0
        }))
      }
    }

    if (type === 'products' || type === 'all') {
      // 商品数据分析
      const [
        topSellingProducts,
        lowStockProducts,
        productsByCategory
      ] = await Promise.all([
        // 热销商品
        prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            order: dateFilter
          },
          _sum: {
            quantity: true
          },
          orderBy: {
            _sum: {
              quantity: 'desc'
            }
          },
          take: 10
        }),
        // 库存不足商品
        prisma.product.findMany({
          where: {
            stock: {
              lt: 10
            }
          },
          select: {
            id: true,
            name: true,
            stock: true,
            price: true
          },
          take: 10
        }),
        // 按分类统计商品
        prisma.product.groupBy({
          by: ['categoryId'],
          _count: {
            id: true
          }
        })
      ])

      // 获取热销商品详情
      const productIds = topSellingProducts.map((item: any) => item.productId)
      const productDetails = await prisma.product.findMany({
        where: {
          id: {
            in: productIds
          }
        },
        select: {
          id: true,
          name: true,
          price: true,
          images: true
        }
      })

      const productMap = productDetails.reduce((acc: any, product: any) => {
        acc[product.id] = product
        return acc
      }, {})

      analyticsData.products = {
        topSelling: topSellingProducts.map((item: any) => ({
          id: productMap[item.productId]?.id,
          name: productMap[item.productId]?.name,
          sales: item._sum.quantity || 0,
          revenue: (productMap[item.productId]?.price || 0) * (item._sum.quantity || 0)
        })),
        lowStock: lowStockProducts,
        categoryStats: await prisma.product.groupBy({
          by: ['categoryId'],
          _count: {
            id: true
          }
        }).then(categories => categories.map((cat: any) => ({
          category: cat.categoryId || '未分类',
          count: cat._count.id
        })))
      }
    }

    if (type === 'users' || type === 'all') {
      // 用户数据分析
      const [
        usersByRole,
        usersByStatus,
        userRegistrationTrend,
        topCustomers
      ] = await Promise.all([
        // 按角色统计用户
        prisma.user.groupBy({
          by: ['role'],
          _count: {
            id: true
          }
        }),
        // 按状态统计用户
        prisma.user.groupBy({
          by: ['role'],
          _count: {
            id: true
          }
        }),
        // 用户注册趋势
        prisma.user.groupBy({
          by: ['createdAt'],
          where: dateFilter,
          _count: {
            id: true
          }
        }),
        // 优质客户（按消费金额排序）
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            _count: {
              select: {
                orders: true
              }
            }
          },
          orderBy: {
            orders: {
              _count: 'desc'
            }
          },
          take: 10
        })
      ])

      // 计算用户消费金额
      const customerSpending = await Promise.all(
        topCustomers.map(async (customer: any) => {
          const spending = await prisma.order.aggregate({
            where: {
              userId: customer.id,
              status: 'DELIVERED'
            },
            _sum: {
              totalAmount: true
            }
          })
          return {
            ...customer,
            totalSpent: spending._sum.totalAmount || 0
          }
        })
      )

      // 计算订单状态百分比
      const totalOrders = ordersByStatus.reduce((sum: number, item: any) => sum + item._count.id, 0)

      analyticsData.users = {
        usersByRole: usersByRole.map((item: any) => ({
          role: item.role,
          count: item._count.id
        })),
        registrationTrend: userRegistrationTrend.map((item: any) => ({
          date: item.createdAt.toISOString().split('T')[0],
          count: item._count.id
        })),
        topCustomers: customerSpending.sort((a: any, b: any) => b.totalSpent - a.totalSpent).map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          totalSpent: customer.totalSpent,
          orderCount: customer._count.orders
        }))
      }
    }

    if (type === 'orders' || type === 'all') {
      // 订单数据分析
      const [
        ordersByStatus,
        orderTrend,
        averageOrderValue,
        ordersByPaymentMethod
      ] = await Promise.all([
        // 按状态统计订单
        prisma.order.groupBy({
          by: ['status'],
          _count: {
            id: true
          }
        }),
        // 订单趋势
        prisma.order.groupBy({
          by: ['createdAt'],
          where: dateFilter,
          _count: {
            id: true
          },
          _sum: {
            totalAmount: true
          }
        }),
        // 平均订单价值
        prisma.order.aggregate({
          where: {
            ...dateFilter,
            status: 'DELIVERED'
          },
          _avg: {
            totalAmount: true
          }
        }),
        // 按支付方式统计订单
        prisma.order.groupBy({
          by: ['paymentMethod'],
          where: dateFilter,
          _count: {
            id: true
          },
          _sum: {
            totalAmount: true
          }
        })
      ])

      // 计算订单状态百分比
      const totalOrdersForStatus = ordersByStatus.reduce((sum: number, item: any) => sum + item._count.id, 0)

      analyticsData.orders = {
        statusDistribution: ordersByStatus.map((item: any) => ({
          status: item.status,
          count: item._count.id,
          percentage: totalOrdersForStatus > 0 ? (item._count.id / totalOrdersForStatus) * 100 : 0
        })),
        orderTrend: orderTrend.map((item: any) => ({
          date: item.createdAt.toISOString().split('T')[0],
          count: item._count.id,
          amount: item._sum.totalAmount || 0
        })),
        averageOrderValue: averageOrderValue._avg.totalAmount || 0,
        paymentMethods: ordersByPaymentMethod.map((item: any) => ({
          method: item.paymentMethod,
          count: item._count.id,
          amount: item._sum.totalAmount || 0
        }))
      }
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    })
  } catch (error) {
    console.error('获取数据统计失败:', error)
    return NextResponse.json(
      { success: false, error: '获取数据统计失败' },
      { status: 500 }
    )
  }
}

// POST /api/analytics/export - 导出数据报告
export async function POST(request: NextRequest) {
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
    const { type, startDate, endDate, format = 'json' } = body

    // 获取数据
    const analyticsResponse = await GET(request)
    const analyticsData = await analyticsResponse.json()

    if (!analyticsData.success) {
      return analyticsData
    }

    // 根据格式返回数据
    if (format === 'csv') {
      // 这里可以实现CSV格式转换
      return NextResponse.json({
        success: true,
        message: 'CSV导出功能待实现',
        data: analyticsData.data
      })
    }

    return NextResponse.json({
      success: true,
      data: analyticsData.data,
      exportedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('导出数据报告失败:', error)
    return NextResponse.json(
      { success: false, error: '导出数据报告失败' },
      { status: 500 }
    )
  }
}