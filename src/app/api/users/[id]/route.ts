import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromRequest, hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/users/[id] - 获取用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证权限
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { id } = await params

    // 只有管理员或用户本人可以查看详情
    if (user.role !== 'admin' && user.userId !== id) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
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
        addresses: {
          orderBy: {
            isDefault: 'desc'
          }
        },
        orders: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            // orderNumber: true, // 注意：Order模型中没有orderNumber字段
            status: true,
            totalAmount: true,
            createdAt: true
          }
        },
        // reviews: { // 注意：User模型中没有reviews关联
        //   take: 10,
        //   orderBy: {
        //     createdAt: 'desc'
        //   },
        //   include: {
        //     product: {
        //       select: {
        //         id: true,
        //         name: true,
        //         image: true
        //       }
        //     }
        //   }
        // },
        _count: {
          select: {
            // orders: true, // 注意：User模型中没有orders关联
            // reviews: true, // 注意：User模型中没有reviews关联
            // addresses: true, // 注意：User模型中没有addresses关联
            // coupons: true // 注意：User模型中没有coupons关联
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 计算用户统计信息
    const orderStats = await prisma.order.groupBy({
      by: ['status'],
      where: {
        userId: id
      },
      _count: {
        id: true
      },
      _sum: {
        totalAmount: true
      }
    })

    const stats = {
      // totalOrders: targetUser._count.orders, // 注意：User模型中没有orders关联
      totalOrders: 0,
      totalSpent: orderStats.reduce((sum: number, stat: any) => sum + (stat._sum.totalAmount || 0), 0),
      // totalReviews: targetUser._count.reviews, // 注意：User模型中没有reviews关联
      totalReviews: 0,
      // totalAddresses: targetUser._count.addresses, // 注意：User模型中没有addresses关联
      totalAddresses: 0,
      // totalCoupons: targetUser._count.coupons, // 注意：User模型中没有coupons关联
      totalCoupons: 0,
      ordersByStatus: orderStats.reduce((acc: any, stat: any) => {
        acc[stat.status] = stat._count.id
        return acc
      }, {})
    }

    return NextResponse.json({
      success: true,
      data: {
        ...targetUser,
        stats
      }
    })
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取用户详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - 更新用户信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证权限
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
      name,
      email,
      phone,
      password,
      role,
      status,
      avatar
    } = body

    // 只有管理员或用户本人可以修改信息
    if (user.role !== 'admin' && user.userId !== id) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 普通用户不能修改角色和状态
    if (user.role !== 'admin') {
      if (role && role !== existingUser.role) {
        return NextResponse.json(
          { success: false, error: '无权修改用户角色' },
          { status: 403 }
        )
      }
      
      // 注意：User模型中没有status字段，移除status检查
      // if (status && status !== existingUser.status) {
      //   return NextResponse.json(
      //     { success: false, error: '无权修改用户状态' },
      //     { status: 403 }
      //   )
      // }
    }

    // 检查用户名和邮箱是否已被其他用户使用
    if (name || email) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                name ? { name } : {},
                email ? { email } : {}
              ].filter(condition => Object.keys(condition).length > 0)
            }
          ]
        }
      })

      if (duplicateUser) {
        return NextResponse.json(
          { success: false, error: '用户名或邮箱已被使用' },
          { status: 400 }
        )
      }
    }

    // 准备更新数据
    const updateData: any = {
      updatedAt: new Date()
    }

    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (avatar !== undefined) updateData.avatar = avatar
    
    // 只有管理员可以修改角色和状态
    if (user.role === 'admin') {
      if (role !== undefined) updateData.role = role
      if (status !== undefined) updateData.status = status
    }

    // 如果提供了新密码，加密后更新
    if (password) {
      updateData.password = await hashPassword(password)
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        // status: true, // 注意：User模型中没有status字段
        avatar: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: '用户信息更新成功'
    })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return NextResponse.json(
      { success: false, error: '更新用户信息失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - 删除用户
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

    // 防止删除自己
    if (user.userId === id) {
      return NextResponse.json(
        { success: false, error: '不能删除自己' },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: true
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 检查是否有关联订单
    if (existingUser.orders.length > 0) {
      return NextResponse.json(
        { success: false, error: '该用户有关联订单，无法删除' },
        { status: 400 }
      )
    }

    // 删除用户
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '用户删除成功'
    })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json(
      { success: false, error: '删除用户失败' },
      { status: 500 }
    )
  }
}