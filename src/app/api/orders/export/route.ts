import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/orders/export - 导出订单数据
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv' // csv 或 excel
    const status = searchParams.get('status') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''

    // 构建查询条件
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // 获取订单数据
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
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
    })

    // 转换数据格式
    const exportData = orders.map(order => ({
      '订单号': order.orderNo,
      '用户姓名': order.user.name || '',
      '用户邮箱': order.user.email,
      '收货人': order.address?.name || '',
      '收货电话': order.address?.phone || '',
      '收货地址': order.address ? 
        `${order.address.province}${order.address.city}${order.address.district}${order.address.detail}` : '',
      '商品数量': order.items.length,
      '商品明细': order.items.map(item => 
        `${item.product.name} x${item.quantity}`
      ).join('; '),
      '订单金额': Number(order.totalAmount),
      '优惠金额': Number(order.discountAmount),
      '运费': Number(order.shippingFee),
      '实付金额': Number(order.finalAmount),
      '订单状态': getStatusText(order.status),
      '支付方式': order.paymentMethod || '',
      '备注': order.remark || '',
      '创建时间': order.createdAt.toLocaleString('zh-CN'),
      '更新时间': order.updatedAt.toLocaleString('zh-CN')
    }))

    if (format === 'csv') {
      // 生成CSV格式
      const csvContent = generateCSV(exportData)
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="orders_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else if (format === 'excel') {
      // 生成Excel格式（简化版，实际项目中可以使用xlsx库）
      const excelContent = generateExcel(exportData)
      
      return new NextResponse(excelContent, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="orders_${new Date().toISOString().split('T')[0]}.xlsx"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: exportData,
      message: '数据导出成功'
    })
  } catch (error) {
    console.error('导出订单数据失败:', error)
    return NextResponse.json(
      { success: false, error: '导出订单数据失败' },
      { status: 500 }
    )
  }
}

// 生成CSV内容
function generateCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvRows = []
  
  // 添加BOM以支持中文
  csvRows.push('\uFEFF')
  
  // 添加表头
  csvRows.push(headers.join(','))
  
  // 添加数据行
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      // 处理包含逗号或换行符的值
      if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}

// 生成Excel内容（简化版）
function generateExcel(data: any[]): string {
  // 这里是一个简化的Excel生成，实际项目中建议使用xlsx库
  // 返回CSV格式作为Excel的简化替代
  return generateCSV(data)
}

// 获取状态文本
function getStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    'PENDING': '待付款',
    'PAID': '已付款',
    'SHIPPED': '已发货',
    'DELIVERED': '已送达',
    'CANCELLED': '已取消',
    'REFUNDED': '已退款'
  }
  return statusMap[status] || status
}