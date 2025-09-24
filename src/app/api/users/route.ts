import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest, hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

interface UserStats {
  role: string
  _count: {
    id: number
  }
}

// GET /api/users - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role) {
      where.role = role
    }
    
    // 注意：User模型中没有status字段，移除status过滤
    // if (status) {
    //   where.status = status
    // }

    // 获取用户列表
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        // status: true, // 注意：User模型中没有status字段
        avatar: true,
        // lastLoginAt: true, // 注意：User模型中没有lastLoginAt字段
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            // reviews: true, // 注意：User模型中没有reviews关联
            addresses: true
          }
        }
      }
    })

    // 获取总数
    const total = await prisma.user.count({ where })

    // 计算统计数据
    const statsResult = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    })

    const roleStats = {
      admin: statsResult.find((s: any) => s.role === 'admin')?._count.id || 0,
      user: statsResult.find((s: any) => s.role === 'user')?._count.id || 0
    }

    // User模型没有status字段，移除statusStats查询
    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: {
          roles: roleStats
        }
      }
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取用户列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/users - 创建新用户
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      email,
      password,
      phone,
      role = 'user',
      status = 'active',
      avatar
    } = body

    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: '用户名、邮箱和密码为必填项' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { name },
          { email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '用户名或邮箱已存在' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await hashPassword(password)

    // 创建用户
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role,
        avatar: avatar || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: newUser,
      message: '用户创建成功'
    })
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json(
      { success: false, error: '创建用户失败' },
      { status: 500 }
    )
  }
}

// PUT /api/users - 批量更新用户
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userIds, updates } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择要更新的用户' },
        { status: 400 }
      )
    }

    // 防止修改自己的状态
    if (updates.status && userIds.includes(user.userId)) {
      return NextResponse.json(
        { success: false, error: '不能修改自己的状态' },
        { status: 400 }
      )
    }

    // 批量更新用户
    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: userIds
        }
      },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message: `成功更新 ${result.count} 个用户`
    })
  } catch (error) {
    console.error('批量更新用户失败:', error)
    return NextResponse.json(
      { success: false, error: '批量更新用户失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/users - 批量删除用户
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = getUserFromRequest(request)
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userIds = searchParams.get('ids')?.split(',') || []

    if (userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '请选择要删除的用户' },
        { status: 400 }
      )
    }

    // 防止删除自己
    if (userIds.includes(user.userId)) {
      return NextResponse.json(
        { success: false, error: '不能删除自己' },
        { status: 400 }
      )
    }

    // 检查是否有关联订单
    const usersWithOrders = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        },
        orders: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    if (usersWithOrders.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `用户 ${usersWithOrders.map((u: any) => u.name).join(', ')} 有关联订单，无法删除` 
        },
        { status: 400 }
      )
    }

    // 删除用户
    const result = await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message: `成功删除 ${result.count} 个用户`
    })
  } catch (error) {
    console.error('批量删除用户失败:', error)
    return NextResponse.json(
      { success: false, error: '批量删除用户失败' },
      { status: 500 }
    )
  }
}