import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ClosableBanner from '@/components/ClosableBanner'
import DynamicSpacer from '@/components/DynamicSpacer'
import Image from 'next/image'
import { getHomeSections } from '../../prisma/getHomeSections';

interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}


export default async function Home() {
  const homeSections = await getHomeSections();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* 为固定导航栏添加顶部间距 */}
      <div className="pt-16">
        {/* Top Promotional Banner */}
        <ClosableBanner 
          className="bg-orange-500 text-white text-center py-2 text-sm"
          storageKey="promotional-banner"
        >
          <p>
            <strong>Free shipping</strong> on orders over £50 | 
            <strong> 30-day returns</strong> | 
            <strong> Official warranty</strong>
          </p>
        </ClosableBanner>

        {/* Dynamic Spacer */}
        <DynamicSpacer />

      {/* Hero Section - Main Banner */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Xiaomi 15 Series<br />
                <span className="text-orange-400">Now Available</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Experience flagship performance with Snapdragon 8 Elite<br />
                Starting from £699 | Free delivery
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/uk/store"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Buy Now
                </Link>
                <Link
                  href="/uk/store"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-8 transform rotate-3 shadow-2xl">
                <div className="bg-white rounded-xl p-6 transform -rotate-3">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Xiaomi 15</h3>
                    <p className="text-gray-600">Flagship. Redefined.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeSections.map((section: HomeSection) => (
              <Link
                key={section.id}
                href={section.buttonLink}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={section.imageUrl}
                    alt={section.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                  <p className="text-sm opacity-90">{section.subtitle}</p>
                  <span className="text-orange-500 font-medium group-hover:text-orange-600">
                    {section.buttonText} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our latest smart home innovations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Xiaomi Robot Vacuum S40C',
                description: 'LDS laser navigation technology delivers exceptional cleaning coverage',
                price: '£299',
                originalPrice: '£399',
                imageUrl: '/MiRobotVacuumS40C.webp',
                imageAlt: '小米扫地机器人S40C产品图'
              },
              {
                name: 'Xiaomi Smart Band 9 Pro',
                description: 'Your style, your pace',
                price: '£69',
                originalPrice: '£89',
                imageUrl: '/XiaoMiSmartBand9Pro.webp',
                imageAlt: '小米手环9 Pro 产品图',
              },
              {
                name: 'Xiaomi Robot Vacuum H40',
                description: 'Anti-tangle vacuuming/mopping with large-capacity dust collection',
                price: '£449',
                originalPrice: '£549',
                imageUrl: '/XiaoMiRobotVacuumH40.png',
                imageAlt: '小米扫地机器人 H40 产品图'
              }
            ].map((product, index) => (
              <div key={product.name} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={(product as any).imageAlt || product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-8xl group-hover:scale-105 transition-transform duration-300">
                      {(product as any).image}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-orange-500">{product.price}</span>
                      <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Limited-Time £15 Voucher on Xiaomi App Download
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Grab Xiaomi UK App Offer: Discount Code [15APP2025] + 100 Points | Mi Store Perks
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Download App
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors">
              Get Voucher
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Support Section */}
            <div>
              <h5 className="text-lg font-semibold mb-6 text-white">SUPPORT</h5>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/support/mi-points" className="hover:text-white transition-colors">Mi Points FAQ</Link></li>
                <li><Link href="/support/shipping" className="hover:text-white transition-colors">Shipping FAQ</Link></li>
                <li><Link href="/support/product" className="hover:text-white transition-colors">Product FAQ</Link></li>
                <li><Link href="/support/trade-in" className="hover:text-white transition-colors">Trade-in</Link></li>
                <li><Link href="/support/coupon" className="hover:text-white transition-colors">Coupon Code</Link></li>
                <li><Link href="/support/exclusive" className="hover:text-white transition-colors">Exclusive Services</Link></li>
                <li><Link href="/support/imei" className="hover:text-white transition-colors">IMEI Redemption</Link></li>
                <li><Link href="/support/student" className="hover:text-white transition-colors">Student Discounts</Link></li>
                <li><Link href="/support/financial" className="hover:text-white transition-colors">Financial Initial Disclosure</Link></li>
                <li><Link href="/support/where-to-buy" className="hover:text-white transition-colors">Where to Buy</Link></li>
                <li><Link href="/support/security" className="hover:text-white transition-colors">Product Security and Telecommunications infrastructure</Link></li>
                <li><Link href="/support/manuals" className="hover:text-white transition-colors">Product User Manuals</Link></li>
              </ul>
            </div>

            {/* Terms and Conditions Section */}
            <div>
              <h5 className="text-lg font-semibold mb-6 text-white">TERMS AND CONDITIONS</h5>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/terms/tc" className="hover:text-white transition-colors">T&C</Link></li>
                <li><Link href="/terms/financing" className="hover:text-white transition-colors">Financing Complaints</Link></li>
                <li><Link href="/terms/uk-declaration" className="hover:text-white transition-colors">UK Declaration of Conformity</Link></li>
                <li><Link href="/terms/scooter-safety" className="hover:text-white transition-colors">Scooter Safety Notice</Link></li>
                <li><Link href="/terms/google-benefits" className="hover:text-white transition-colors">T&C of Google One Benefits</Link></li>
              </ul>
            </div>

            {/* Shop and Learn Section */}
            <div>
              <h5 className="text-lg font-semibold mb-6 text-white">SHOP AND LEARN</h5>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link href="/uk/store" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/uk/store/xiaomi-series" className="hover:text-white transition-colors">Xiaomi Series</Link></li>
                <li><Link href="/uk/store/redmi-series" className="hover:text-white transition-colors">Redmi Series</Link></li>
                <li><Link href="/uk/store/poco" className="hover:text-white transition-colors">POCO</Link></li>
                <li><Link href="/uk/store/smart-home" className="hover:text-white transition-colors">Smart Home</Link></li>
                <li><Link href="/uk/store/lifestyle" className="hover:text-white transition-colors">Lifestyle</Link></li>
                <li><Link href="/business" className="hover:text-white transition-colors">Xiaomi for Business</Link></li>
                <li><Link href="/hyperos" className="hover:text-white transition-colors">HyperOS</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">Xiaomi News</Link></li>
                <li><Link href="/coupons" className="hover:text-white transition-colors">New User Coupons</Link></li>
                <li><Link href="/student-discounts" className="hover:text-white transition-colors">Student Discounts</Link></li>
              </ul>
            </div>

            {/* About Us and Newsletter Section */}
            <div>
              <h5 className="text-lg font-semibold mb-6 text-white">ABOUT US</h5>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li><Link href="/about/xiaomi" className="hover:text-white transition-colors">Xiaomi</Link></li>
                <li><Link href="/about/leadership" className="hover:text-white transition-colors">Leadership Team</Link></li>
                <li><Link href="/about/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/about/integrity" className="hover:text-white transition-colors">Integrity & Compliance</Link></li>
                <li><Link href="/about/accessibility" className="hover:text-white transition-colors">Xiaomi Accessibility</Link></li>
                <li><Link href="/about/trust" className="hover:text-white transition-colors">Trust Centre</Link></li>
              </ul>

              {/* Follow Xiaomi */}
              <div className="mb-8">
                <h6 className="text-base font-semibold mb-4 text-white">Follow Xiaomi</h6>
                <div className="flex space-x-4">
                  <Link href="https://facebook.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Link>
                  <Link href="https://twitter.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </Link>
                  <Link href="https://instagram.com/xiaomi" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.876.875 1.366 2.026 1.366 3.323s-.49 2.448-1.366 3.323c-.875.807-2.026 1.218-3.323 1.218zm7.718-9.092c-.876 0-1.635-.759-1.635-1.635s.759-1.635 1.635-1.635 1.635.759 1.635 1.635-.759 1.635-1.635 1.635zm0 0"/>
                    </svg>
                  </Link>
                  <Link href="https://tiktok.com/@xiaomi" className="text-gray-300 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h6 className="text-base font-semibold mb-4 text-white">Enter your email address to subscribe to our newsletters</h6>
                <div className="flex gap-2 mb-6">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm"
                  />
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* App Download */}
                <div className="border border-gray-600 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2zm0 4h7v2H7v-2zm0 4h7v2H7v-2z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h6 className="text-white font-semibold text-sm">Get the Xiaomi Store App</h6>
                      <p className="text-gray-400 text-xs">Scan for up-to-date info and a better shopping experience</p>
                    </div>
                  </div>
                </div>

                {/* Google Play Download */}
                <Link href="https://play.google.com/store/apps/details?id=com.xiaomi.shop" className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Download on Google Play
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <p>Copyright © 2010 - 2025 Xiaomi. All Rights Reserved</p>
                <Link href="/cookie-settings" className="hover:text-white transition-colors">Cookie settings</Link>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
                <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>United Kingdom / English</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
