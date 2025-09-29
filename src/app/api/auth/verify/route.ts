import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 从请求中获取用户信息
    const userPayload = getUserFromRequest(request)
    
    if (!userPayload) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401, headers: { 'Cache-Control': 'no-store', 'Pragma': 'no-cache', 'Vary': 'Cookie, Authorization' } }
      )
    }

    // 从数据库获取完整的用户信息
    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404, headers: { 'Cache-Control': 'no-store', 'Pragma': 'no-cache', 'Vary': 'Cookie, Authorization' } }
      )
    }

    return NextResponse.json({
      message: '验证成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    }, { headers: { 'Cache-Control': 'no-store', 'Pragma': 'no-cache', 'Vary': 'Cookie, Authorization' } })

  } catch (error: any) {
    // 统一为非敏感错误日志
    console.error('用户验证错误')
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500, headers: { 'Cache-Control': 'no-store', 'Pragma': 'no-cache', 'Vary': 'Cookie, Authorization' } }
    )
  }
}