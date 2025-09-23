import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/products/[id] - 获取单个商品详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        // reviews: { // 注意：Product模型中没有reviews关联
        //   include: {
        //     user: {
        //       select: {
        //         id: true,
        //         name: true,
        //         avatar: true
        //       }
        //     }
        //   },
        //   orderBy: {
        //     createdAt: 'desc'
        //   }
        // },
        _count: {
          select: {
            orderItems: true
            // reviews: true // 注意：Product模型中没有reviews关联
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: '商品不存在' },
        { status: 404 }
      )
    }

    // 计算平均评分 - 注意：由于没有reviews关联，暂时设为0
    // const avgRating = product.reviews.length > 0
    //   ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
    //   : 0
    const avgRating = 0

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        totalSales: product._count.orderItems,
        // totalReviews: product._count.reviews // 注意：没有reviews关联
        totalReviews: 0
      }
    })
  } catch (error) {
    console.error('获取商品详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取商品详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - 更新单个商品
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // 检查商品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: '商品不存在' },
        { status: 404 }
      )
    }

    // 如果更新SKU，检查是否与其他商品冲突 - 注意：Product模型中没有sku字段
    // if (body.sku && body.sku !== existingProduct.sku) {
    //   const skuConflict = await prisma.product.findFirst({
    //     where: {
    //       sku: body.sku,
    //       id: { not: id }
    //     }
    //   })

    //   if (skuConflict) {
    //     return NextResponse.json(
    //       { success: false, error: 'SKU已存在' },
    //       { status: 400 }
    //     )
    //   }
    // }

    // 更新商品
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
        stock: body.stock ? parseInt(body.stock) : undefined,
        // minStock: body.minStock ? parseInt(body.minStock) : undefined, // 注意：Product模型中没有minStock字段
        // weight: body.weight ? parseFloat(body.weight) : undefined, // 注意：Product模型中没有weight字段
        categoryId: body.categoryId,
        specs: body.specs,
        images: body.images,
        // sku: body.sku, // 注意：Product模型中没有sku字段
        // brand: body.brand, // 注意：Product模型中没有brand字段
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: '商品更新成功'
    })
  } catch (error) {
    console.error('更新商品失败:', error)
    return NextResponse.json(
      { success: false, error: '更新商品失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - 删除单个商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const { id } = await params

    // 检查商品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: '商品不存在' },
        { status: 404 }
      )
    }

    // 检查是否有关联的订单项
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id }
    })

    if (orderItems) {
      return NextResponse.json(
        { success: false, error: '无法删除已有订单的商品' },
        { status: 400 }
      )
    }

    // 删除商品（级联删除相关的评论等）
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '商品删除成功'
    })
  } catch (error) {
    console.error('删除商品失败:', error)
    return NextResponse.json(
      { success: false, error: '删除商品失败' },
      { status: 500 }
    )
  }
}