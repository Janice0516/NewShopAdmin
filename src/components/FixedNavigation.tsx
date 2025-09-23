'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBagIcon, Bars3Icon, MagnifyingGlassIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function FixedNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: '首页', href: '/', isActive: pathname === '/' },
    { name: 'Mobile', href: '/products/mobile', isActive: pathname.startsWith('/products/mobile') },
    { name: 'Wearables', href: '/products/wearables', isActive: pathname.startsWith('/products/wearables') },
    { name: 'Smart Home', href: '/products/smart-home', isActive: pathname.startsWith('/products/smart-home') },
    { name: 'Lifestyle', href: '/products/lifestyle', isActive: pathname.startsWith('/products/lifestyle') },
    { name: 'POCO', href: '/products/poco', isActive: pathname.startsWith('/products/poco') },
    { name: 'Discover', href: '/discover', isActive: pathname.startsWith('/discover') },
    { name: 'Support', href: '/support', isActive: pathname.startsWith('/support') },
    { name: 'Community', href: '/community', isActive: pathname.startsWith('/community') },
  ]

  return (
    <>
      {/* Top Banner */}
      <div className="bg-orange-500 text-white text-center py-2 text-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4">
          Golden Season Sale - Enjoy Up to 50% Off Smart Tech. 18th Sep. - 10th Oct.
        </div>
      </div>

      {/* Fixed Navigation */}
      <header className="fixed top-8 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">Mi</span>
                </div>
                <span className="text-xl font-semibold text-gray-900 hidden sm:block">Mi Store</span>
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
                href="/login" 
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