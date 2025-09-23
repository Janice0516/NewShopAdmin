import Link from 'next/link'
import FixedNavigation from '@/components/FixedNavigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <FixedNavigation />

      {/* Hero Section - Main Banner */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Xiaomi Launch<br />
                <span className="text-orange-400">September 2025</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Munich | 24.09.2025 | 13:00 BST<br />
                Xiaomi TV F/F Pro 2026 Series
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Shop Now
                </Link>
                <Link
                  href="/lottery"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-8 transform rotate-3 shadow-2xl">
                <div className="bg-white rounded-xl p-6 transform -rotate-3">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">New Launch</h3>
                    <p className="text-gray-600">Massive views, massive fun</p>
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
            {[
              {
                title: 'Smartphones',
                subtitle: 'Up to 5% off with Mi Points',
                image: '📱',
                color: 'from-blue-500 to-purple-600'
              },
              {
                title: 'Tablets',
                subtitle: 'Recommend Tablets',
                image: '📱',
                color: 'from-green-500 to-teal-600'
              },
              {
                title: 'Smart Watches',
                subtitle: 'Your style, your pace',
                image: '⌚',
                color: 'from-orange-500 to-red-600'
              },
              {
                title: 'Smart Home',
                subtitle: 'Vacuum Cleaners & More',
                image: '🏠',
                color: 'from-purple-500 to-pink-600'
              }
            ].map((category, index) => (
              <Link
                key={index}
                href="/products"
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className={`bg-gradient-to-br ${category.color} p-6 text-white relative`}>
                  <div className="text-4xl mb-4">{category.image}</div>
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-sm opacity-90">{category.subtitle}</p>
                  <div className="absolute top-4 right-4 opacity-20 text-6xl">
                    {category.image}
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-orange-500 font-medium group-hover:text-orange-600">
                    Explore →
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
                name: 'Xiaomi Robot Vacuum S40',
                description: 'LDS laser navigation for superior cleaning coverage',
                price: '£299',
                originalPrice: '£399',
                image: '🤖'
              },
              {
                name: 'Xiaomi Smart Band 9 Pro',
                description: 'Your style, your pace',
                price: '£69',
                originalPrice: '£89',
                image: '⌚'
              },
              {
                name: 'Xiaomi Robot Vacuum H40',
                description: 'Anti-tangle vacuuming/mopping with large-capacity dust collection',
                price: '£449',
                originalPrice: '£549',
                image: '🧹'
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-300">
                  {product.image}
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

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to our newsletters</h2>
          <p className="text-gray-400 mb-8">Subscribe to get the latest news and exclusive offers</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4 text-gray-900">Mi Store</h5>
              <p className="text-gray-600 text-sm">
                Discover the latest smart technology and innovative products that enhance your lifestyle.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4 text-gray-900">Products</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/products" className="hover:text-orange-500">Smartphones</Link></li>
                <li><Link href="/products" className="hover:text-orange-500">Tablets</Link></li>
                <li><Link href="/products" className="hover:text-orange-500">Wearables</Link></li>
                <li><Link href="/products" className="hover:text-orange-500">Smart Home</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4 text-gray-900">Support</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/help" className="hover:text-orange-500">Help Center</Link></li>
                <li><Link href="/shipping" className="hover:text-orange-500">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-orange-500">Returns</Link></li>
                <li><Link href="/warranty" className="hover:text-orange-500">Warranty</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4 text-gray-900">Contact</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Customer Service: 400-123-4567</li>
                <li>Email: service@mistore.com</li>
                <li>Hours: 9:00-18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 Mi Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
