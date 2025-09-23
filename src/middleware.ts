import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

// 强制使用 Node.js runtime 而不是 Edge runtime
export const runtime = 'nodejs'

// 需要登录才能访问的路由
const protectedRoutes = ['/dashboard', '/profile', '/orders', '/admin']

// 管理员专用路由 - 包含所有admin子路径
const adminRoutes = ['/admin']

// 客户专用路由（管理员不能访问）
const customerRoutes = ['/dashboard', '/profile', '/orders']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // 获取用户信息
  const user = await getUserFromRequest(request)

  // 如果用户未登录，重定向到相应的登录页面
  if (!user) {
    // 如果访问管理员路由，重定向到管理员登录页面
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    // 否则重定向到客户登录页面
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 检查管理员路由访问权限
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '访问被拒绝：需要管理员权限' },
        { status: 403 }
      )
    }
  }

  // 检查客户路由访问权限（防止管理员访问客户专用页面）
  if (customerRoutes.some(route => pathname.startsWith(route))) {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      // 管理员访问客户路由时，重定向到管理员仪表盘
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - register (register page)
     * - admin/login (admin login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|admin/login).*)',
  ],
}