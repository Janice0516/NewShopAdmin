import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

// 校验基本必填字段
function validateAddressPayload(payload: any) {
  const required = ['name', 'phone', 'province', 'city', 'district', 'detail']
  for (const key of required) {
    if (!payload[key] || typeof payload[key] !== 'string') {
      return `字段 ${key} 为必填且必须为字符串`
    }
  }
  return null
}

// 统一输出格式化
function toDTO(addr: any) {
  return {
    id: addr.id,
    name: addr.name,
    phone: addr.phone,
    province: addr.province,
    city: addr.city,
    district: addr.district,
    detail: addr.detail,
    isDefault: addr.isDefault,
    createdAt: addr.createdAt,
    updatedAt: addr.updatedAt,
  }
}

// GET /api/addresses - 获取当前用户的地址簿列表
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }]
    })

    return NextResponse.json({ success: true, data: addresses.map(toDTO) })
  } catch (error) {
    console.error('获取地址列表失败:', error)
    return NextResponse.json({ success: false, error: '获取地址列表失败' }, { status: 500 })
  }
}

// POST /api/addresses - 新增地址 { name, phone, province, city, district, detail, isDefault? }
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const err = validateAddressPayload(body)
    if (err) {
      return NextResponse.json({ success: false, error: err }, { status: 400 })
    }

    const { name, phone, province, city, district, detail, isDefault = false } = body

    // 若设置为默认地址，先将该用户其他地址默认标记清除
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId, isDefault: true },
        data: { isDefault: false }
      })
    }

    const created = await prisma.address.create({
      data: {
        userId: user.userId,
        name,
        phone,
        province,
        city,
        district,
        detail,
        isDefault: Boolean(isDefault)
      }
    })

    return NextResponse.json({ success: true, data: toDTO(created), message: '地址创建成功' })
  } catch (error) {
    console.error('创建地址失败:', error)
    return NextResponse.json({ success: false, error: '创建地址失败' }, { status: 500 })
  }
}

// PUT /api/addresses - 更新地址 { id, name?, phone?, province?, city?, district?, detail?, isDefault? }
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { id, name, phone, province, city, district, detail, isDefault } = body

    if (!id) {
      return NextResponse.json({ success: false, error: '缺少地址ID' }, { status: 400 })
    }

    const existing = await prisma.address.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.userId) {
      return NextResponse.json({ success: false, error: '地址不存在或无权限' }, { status: 404 })
    }

    // 如果要设置默认地址，先取消该用户其他默认地址
    if (typeof isDefault === 'boolean' && isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId, isDefault: true },
        data: { isDefault: false }
      })
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        name,
        phone,
        province,
        city,
        district,
        detail,
        isDefault
      }
    })

    return NextResponse.json({ success: true, data: toDTO(updated), message: '地址更新成功' })
  } catch (error) {
    console.error('更新地址失败:', error)
    return NextResponse.json({ success: false, error: '更新地址失败' }, { status: 500 })
  }
}

// DELETE /api/addresses - 删除地址 { id }
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: '缺少地址ID' }, { status: 400 })
    }

    const existing = await prisma.address.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.userId) {
      return NextResponse.json({ success: false, error: '地址不存在或无权限' }, { status: 404 })
    }

    await prisma.address.delete({ where: { id } })

    return NextResponse.json({ success: true, message: '地址已删除' })
  } catch (error) {
    console.error('删除地址失败:', error)
    return NextResponse.json({ success: false, error: '删除地址失败' }, { status: 500 })
  }
}