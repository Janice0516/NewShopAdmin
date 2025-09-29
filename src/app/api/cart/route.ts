import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

function parseFirstImage(images: string | null | undefined): string | null {
  if (!images) return null
  try {
    const arr = JSON.parse(images)
    if (Array.isArray(arr) && arr.length > 0) return arr[0]
    return null
  } catch {
    // 如果不是 JSON，可能是单个 URL 字符串
    return images
  }
}

// GET /api/cart - 获取当前用户购物车列表
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: {
        product: true
      }
    })

    const data = items.map((ci) => {
      const image = parseFirstImage(ci.product.images) || '/images/placeholder.png'
      return {
        id: ci.id,
        productId: ci.productId,
        name: ci.product.name,
        price: Number(ci.product.price),
        originalPrice: ci.product.originalPrice ? Number(ci.product.originalPrice) : undefined,
        image,
        quantity: ci.quantity,
        inStock: ci.product.stock > 0
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('获取购物车失败:', error)
    return NextResponse.json({ success: false, error: '获取购物车失败' }, { status: 500 })
  }
}

// POST /api/cart - 加入购物车 { productId, quantity? }
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId || quantity < 1) {
      return NextResponse.json({ success: false, error: '参数不合法' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product || !product.isActive) {
      return NextResponse.json({ success: false, error: '商品不存在或已下架' }, { status: 400 })
    }

    if (product.stock < 1) {
      return NextResponse.json({ success: false, error: '商品库存不足' }, { status: 400 })
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: user.userId, productId } }
    })

    let newQuantity = quantity
    if (existing) newQuantity = existing.quantity + quantity
    if (newQuantity > product.stock) newQuantity = product.stock

    const saved = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: newQuantity }
        })
      : await prisma.cartItem.create({
          data: { userId: user.userId, productId, quantity: newQuantity }
        })

    const full = await prisma.cartItem.findUnique({
      where: { id: saved.id },
      include: { product: true }
    })

    if (!full) {
      return NextResponse.json({ success: false, error: '加入购物车失败' }, { status: 500 })
    }

    const image = parseFirstImage(full.product.images) || '/images/placeholder.png'
    return NextResponse.json({
      success: true,
      data: {
        id: full.id,
        productId: full.productId,
        name: full.product.name,
        price: Number(full.product.price),
        originalPrice: full.product.originalPrice ? Number(full.product.originalPrice) : undefined,
        image,
        quantity: full.quantity,
        inStock: full.product.stock > 0
      },
      message: '已加入购物车'
    })
  } catch (error) {
    console.error('加入购物车失败:', error)
    return NextResponse.json({ success: false, error: '加入购物车失败' }, { status: 500 })
  }
}

// PUT /api/cart - 更新购物车项数量 { itemId?, productId?, quantity }
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const body = await request.json()
    const { itemId, productId, quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json({ success: false, error: '数量必须大于等于1' }, { status: 400 })
    }

    let item = null as any
    if (itemId) {
      item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { product: true } })
    } else if (productId) {
      item = await prisma.cartItem.findUnique({ where: { userId_productId: { userId: user.userId, productId } }, include: { product: true } })
    } else {
      return NextResponse.json({ success: false, error: '缺少 itemId 或 productId' }, { status: 400 })
    }

    if (!item || item.userId !== user.userId) {
      return NextResponse.json({ success: false, error: '购物车项不存在' }, { status: 404 })
    }

    if (item.product.stock < quantity) {
      return NextResponse.json({ success: false, error: '库存不足，无法设置该数量' }, { status: 400 })
    }

    const updated = await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity }
    })

    return NextResponse.json({ success: true, data: { id: updated.id, quantity: updated.quantity }, message: '数量已更新' })
  } catch (error) {
    console.error('更新购物车失败:', error)
    return NextResponse.json({ success: false, error: '更新购物车失败' }, { status: 500 })
  }
}

// DELETE /api/cart - 删除购物车项 { itemId?, productId? }
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { itemId, productId } = body as { itemId?: string; productId?: string }

    let item = null as any
    if (itemId) {
      item = await prisma.cartItem.findUnique({ where: { id: itemId } })
    } else if (productId) {
      item = await prisma.cartItem.findUnique({ where: { userId_productId: { userId: user.userId, productId } } })
    }

    if (!item || item.userId !== user.userId) {
      return NextResponse.json({ success: false, error: '购物车项不存在' }, { status: 404 })
    }

    await prisma.cartItem.delete({ where: { id: item.id } })

    return NextResponse.json({ success: true, message: '已从购物车移除' })
  } catch (error) {
    console.error('删除购物车项失败:', error)
    return NextResponse.json({ success: false, error: '删除购物车项失败' }, { status: 500 })
  }
}