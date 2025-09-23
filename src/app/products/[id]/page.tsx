'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { StarIcon, HeartIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  description: string
  features: string[]
  specifications: { [key: string]: string }
  images: string[]
}

// 模拟商品详细数据
const mockProductDetails: { [key: string]: Product } = {
  '1': {
    id: '1',
    name: '小米智能台灯Pro',
    price: 299,
    originalPrice: 399,
    image: '💡',
    category: 'lighting',
    rating: 4.8,
    reviews: 1234,
    inStock: true,
    description: '小米智能台灯Pro采用全光谱LED灯珠，提供接近自然光的照明体验。支持App控制，可调节亮度和色温，护眼模式让您在夜晚也能舒适阅读。',
    features: [
      '全光谱LED灯珠，Ra95高显色指数',
      '无频闪护眼技术',
      'App智能控制，支持小爱同学语音控制',
      '2700K-6500K色温调节',
      '无极调光，1%-100%亮度调节',
      '定时开关机功能'
    ],
    specifications: {
      '功率': '12W',
      '色温': '2700K-6500K',
      '显色指数': 'Ra95',
      '连接方式': 'Wi-Fi 2.4GHz',
      '尺寸': '420×200×400mm',
      '重量': '1.2kg'
    },
    images: ['💡', '🔆', '🌟', '✨']
  },
  '2': {
    id: '2',
    name: '米家智能摄像头',
    price: 199,
    image: '📹',
    category: 'security',
    rating: 4.6,
    reviews: 856,
    inStock: true,
    description: '米家智能摄像头提供1080P高清画质，支持夜视功能和移动侦测。通过手机App可随时查看家中情况，保护您的家庭安全。',
    features: [
      '1080P全高清画质',
      '红外夜视功能',
      '移动侦测报警',
      '双向语音通话',
      '云存储和本地存储',
      '360°水平旋转'
    ],
    specifications: {
      '分辨率': '1920×1080',
      '视角': '110°广角',
      '夜视距离': '10米',
      '存储': 'MicroSD卡/云存储',
      '连接方式': 'Wi-Fi 2.4GHz',
      '尺寸': '78×78×118mm'
    },
    images: ['📹', '🎥', '👁️', '🔍']
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    // 模拟从API获取产品详情
    const productDetail = mockProductDetails[productId]
    if (productDetail) {
      setProduct(productDetail)
    }
  }, [productId])

  const handleAddToCart = () => {
    // 这里应该调用添加到购物车的API
    alert(`已将 ${quantity} 个 ${product?.name} 添加到购物车`)
  }

  const handleBuyNow = () => {
    // 这里应该跳转到结算页面
    alert('立即购买功能开发中')
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">产品不存在</p>
          <Link href="/products" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">
            返回产品列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              智能家居商城
            </Link>
            <nav className="flex space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-gray-900">
                商品
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                购物车
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                登录
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                首页
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                商品
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <span className="text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 产品图片 */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-8xl">
              {product.images[selectedImage]}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  {img}
                </button>
              ))}
            </div>
          </div>

          {/* 产品信息 */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* 评分和评价 */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} 条评价)
                </span>
              </div>
            </div>

            {/* 价格 */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-red-600">¥{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">¥{product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                  省¥{product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* 库存状态 */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="text-green-600 font-medium">现货</span>
              ) : (
                <span className="text-red-600 font-medium">缺货</span>
              )}
            </div>

            {/* 数量选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                数量
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                加入购物车
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                立即购买
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            {/* 服务保障 */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">服务保障</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <TruckIcon className="h-4 w-4 mr-2" />
                  全国包邮，48小时内发货
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  7天无理由退换货
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  1年质保，终身维护
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 产品详情标签页 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'description', name: '产品描述' },
                { id: 'features', name: '产品特色' },
                { id: 'specifications', name: '规格参数' },
                { id: 'reviews', name: '用户评价' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-3 px-4 font-medium text-gray-900 w-1/3">{key}</td>
                        <td className="py-3 px-4 text-gray-700">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <p className="text-gray-500">用户评价功能开发中...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}