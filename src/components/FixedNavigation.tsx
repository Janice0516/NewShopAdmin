'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBagIcon, Bars3Icon, MagnifyingGlassIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import ClosableBanner from './ClosableBanner'
import Image from 'next/image'

export default function FixedNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(true)

  // 检查公告栏是否可见
  useEffect(() => {
    const checkBannerVisibility = () => {
      if (typeof window !== 'undefined') {
        const isGoldenSeasonClosed = localStorage.getItem('golden-season-banner') === 'closed'
        setIsBannerVisible(!isGoldenSeasonClosed)
      }
    }

    checkBannerVisibility()
    
    // 监听存储变化
    const handleStorageChange = () => {
      checkBannerVisibility()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // 监听自定义事件（当在同一页面关闭横幅时）
    const handleBannerClose = () => {
      setIsBannerVisible(false)
    }
    
    window.addEventListener('bannerClosed', handleBannerClose)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannerClosed', handleBannerClose)
    }
  }, [])

  const navigationItems = [
    { name: 'Store', href: '/', isActive: pathname === '/' },
    { name: 'Mobile', href: '/uk/store/mobile', isActive: pathname.startsWith('/uk/store/mobile') },
    { name: 'Wearables', href: '/uk/store/wearables', isActive: pathname.startsWith('/uk/store/wearables') },
    { name: 'Smart Home', href: '/uk/store/smart-home', isActive: pathname.startsWith('/uk/store/smart-home') },
    { name: 'Lifestyle', href: '/uk/store/lifestyle', isActive: pathname.startsWith('/uk/store/lifestyle') },
    { name: 'POCO', href: '/uk/store/poco', isActive: pathname.startsWith('/uk/store/poco') },
    { name: 'Discover', href: '/discover', isActive: pathname.startsWith('/discover') },
    { name: 'Support', href: '/support', isActive: pathname.startsWith('/support') },
    { name: 'Community', href: '/community', isActive: pathname.startsWith('/community') },
  ]

  return (
    <>
      {/* Top Banner */}
      <ClosableBanner 
        className="bg-orange-500 text-white text-center py-2 text-sm relative z-50"
        storageKey="golden-season-banner"
      >
        <div className="max-w-7xl mx-auto px-4">
          Golden Season Sale - Enjoy Up to 50% Off Smart Tech. 18th Sep. - 10th Oct.
        </div>
      </ClosableBanner>

      {/* Fixed Navigation */}
      <header className={`fixed left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40 transition-all duration-300 ${
        isBannerVisible ? 'top-8' : 'top-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" aria-label="Xiaomi 首页">
                <Image
                  src="/Xiaomi_logo_(2021-).svg.png"
                  alt="Xiaomi Logo"
                  width={32}
                  height={32}
                  className="rounded-sm mr-3"
                  priority
                />
                <span className="text-xl font-semibold text-gray-900 hidden sm:block">Xiaomi UK</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 min-h-[44px] flex items-center ${
                    item.isActive
                      ? 'text-orange-500 font-semibold border-b-2 border-orange-500'
                      : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-1">
              <button className="p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                <HeartIcon className="h-5 w-5" />
              </button>
              <Link 
                href="/cart" 
                className="p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ShoppingBagIcon className="h-5 w-5" />
              </Link>
              <Link 
                href="/register" 
                className="p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
              
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-md min-h-[44px] flex items-center ${
                      item.isActive
                        ? 'text-orange-500 font-semibold bg-orange-50'
                        : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-24"></div>
    </>
  )
}