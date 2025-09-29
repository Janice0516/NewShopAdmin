'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  TicketIcon,
  GiftIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const menuItems: MenuItem[] = [
  { name: '仪表盘', href: '/admin/dashboard', icon: HomeIcon },
  { name: '用户管理', href: '/admin/users', icon: UsersIcon },
  { name: '商品管理', href: '/admin/products', icon: ShoppingBagIcon },
  // 新增：分类管理
  { name: '分类管理', href: '/admin/categories', icon: ViewColumnsIcon },
  { name: '首页栏目管理', href: '/admin/home-sections', icon: ViewColumnsIcon },
  { name: '订单管理', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: '优惠券管理', href: '/admin/coupons', icon: TicketIcon },
  { name: '抽奖活动', href: '/admin/lottery', icon: GiftIcon },
  { name: '数据统计', href: '/admin/analytics', icon: ChartBarIcon },
  { name: '系统设置', href: '/admin/settings', icon: Cog6ToothIcon },
]

// Loading component that matches the server-rendered structure
const LoadingLayout = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <p className="text-gray-500 text-lg">加载中...</p>
    </div>
  </div>
)

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // 如果是登录页面，不需要进行权限验证
    if (pathname === '/admin/login') {
      setIsLoading(false)
      return
    }
    // 检查管理员权限
    const checkAuth = async () => {
      try {
        // 移除敏感日志：不再打印路径与 Cookie
        
        // 添加延迟确保cookie已设置
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const userData = await response.json()
          // 移除敏感日志：不再输出用户数据
          
          if (userData.user && (userData.user.role === 'ADMIN' || userData.user.role === 'SUPER_ADMIN')) {
            setUser({
              name: userData.user.name || '管理员',
              role: userData.user.role
            })
          } else {
            // 用户角色不符合要求，跳转到登录页面
            router.push('/admin/login')
          }
        } else {
          // 未登录或验证失败，重定向到登录页面
          router.push('/admin/login')
        }
      } catch (error) {
        // 统一错误日志，避免泄漏敏感信息
        console.error('权限验证失败')
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (e) {
      // 统一错误日志，避免输出异常细节
      console.error('登出失败')
    } finally {
      router.push('/login')
    }
  }

  // 在客户端渲染完成前显示加载状态
  if (isLoading) {
    return <LoadingLayout />
  }

  // 如果是登录页面，直接返回子组件，不使用管理后台布局
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // 如果用户未登录，显示加载状态（会被重定向到登录页面）
  if (!user) {
    return <LoadingLayout />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">管理后台</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">管理后台</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                欢迎，{user.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon className="mr-1 h-4 w-4" />
                退出
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

// Use dynamic import to prevent hydration mismatch
const DynamicAdminLayout = dynamic(() => Promise.resolve(AdminLayoutContent), {
  ssr: false,
  loading: () => <LoadingLayout />
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DynamicAdminLayout>{children}</DynamicAdminLayout>
}