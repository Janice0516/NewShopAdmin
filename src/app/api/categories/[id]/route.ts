import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, type JWTPayload } from '@/lib/auth'

function mapCategoryCode(name?: string): string {
  const raw = (name || '').trim()
  const n = raw.toLowerCase()
  if (raw === '穿戴设备/手表' || n === 'wearable' || n === 'wearables') return 'wearable'
  if (raw === '智能家居' || n === 'smart home' || n === 'home goods') return 'smart_home'
  if (raw === '生活用品' || n === 'life style' || n === 'lifestyle') return 'life_style'
  return n.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'uncategorized'
}

function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!cookieHeader) return out
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.split('=')
    const key = k?.trim()
    const value = rest.join('=').trim()
    if (key) out[key] = decodeURIComponent(value || '')
  }
  return out
}

function getUserFromRequest(request: Request): JWTPayload | null {
  const authHeader = request.headers.get('authorization') || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = parseCookieHeader(cookieHeader)
  const token = bearer || cookies['admin_token'] || cookies['token']
  if (!token) return null
  return verifyToken(token)
}

export async function PUT(request: Request, context: any) {
  try {
    const user = getUserFromRequest(request)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, error: '权限不足' }, { status: 403 })
    }

    const id = context?.params?.id as string
    const body = await request.json()
    const { name, description, image, parentId, sort, isActive } = body || {}

    if (name && typeof name !== 'string') {
      return NextResponse.json({ success: false, error: '名称格式错误' }, { status: 400 })
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(typeof name === 'string' ? { name: name.trim() } : {}),
        ...(typeof description === 'string' || description === null ? { description } : {}),
        ...(typeof image === 'string' || image === null ? { image } : {}),
        ...(typeof parentId === 'string' || parentId === null ? { parentId } : {}),
        ...(typeof sort === 'number' ? { sort } : {}),
        ...(typeof isActive === 'boolean' ? { isActive } : {})
      },
      select: { id: true, name: true, description: true, isActive: true }
    })

    return NextResponse.json({ success: true, data: { ...updated, code: mapCategoryCode(updated.name) } })
  } catch (error: any) {
    console.error('更新分类失败:', error)
    const isDuplicate = String(error?.message || '').includes('Unique constraint')
    return NextResponse.json({ success: false, error: isDuplicate ? '分类名称已存在' : '更新分类失败' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const user = getUserFromRequest(request)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, error: '权限不足' }, { status: 403 })
    }

    const id = context?.params?.id as string
    const { searchParams } = new URL(request.url)
    const hard = searchParams.get('hard') === 'true'

    if (hard) {
      await prisma.category.delete({ where: { id } })
      return NextResponse.json({ success: true })
    } else {
      const updated = await prisma.category.update({
        where: { id },
        data: { isActive: false },
        select: { id: true, name: true, description: true, isActive: true }
      })
      return NextResponse.json({ success: true, data: { ...updated, code: mapCategoryCode(updated.name) } })
    }
  } catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json({ success: false, error: '删除分类失败' }, { status: 500 })
  }
}