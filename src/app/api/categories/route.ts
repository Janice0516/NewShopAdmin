import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function mapCategoryCode(name?: string): string {
  const raw = (name || '').trim()
  const n = raw.toLowerCase()
  if (raw === '穿戴设备/手表' || n === 'wearable' || n === 'wearables') return 'wearable'
  if (raw === '智能家居' || n === 'smart home' || n === 'home goods') return 'smart_home'
  if (raw === '生活用品' || n === 'life style' || n === 'lifestyle') return 'life_style'
  return n.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'uncategorized'
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, description: true },
      orderBy: { name: 'asc' }
    })

    const data = categories.map(c => ({ ...c, code: mapCategoryCode(c.name) }))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, error: '权限不足' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, image, parentId, sort, isActive } = body || {}

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ success: false, error: '分类名称不能为空' }, { status: 400 })
    }

    const created = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        sort: typeof sort === 'number' ? sort : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true
      },
      select: { id: true, name: true, description: true }
    })

    return NextResponse.json({ success: true, data: { ...created, code: mapCategoryCode(created.name) } })
  } catch (error: any) {
    console.error('创建分类失败:', error)
    const isDuplicate = String(error?.message || '').includes('Unique constraint')
    return NextResponse.json({ success: false, error: isDuplicate ? '分类名称已存在' : '创建分类失败' }, { status: 500 })
  }
}