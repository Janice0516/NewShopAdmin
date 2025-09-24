'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { validateEmailOrPhone, validatePassword, FieldValidation, createFieldValidation, updateFieldValidation } from '@/utils/validation'

export default function CustomerLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [fieldValidations, setFieldValidations] = useState({
    email: createFieldValidation(),
    password: createFieldValidation()
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 验证所有字段
    const emailValidation = validateEmailOrPhone(formData.email)
    const passwordValidation = validatePassword(formData.password)

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setFieldValidations({
        email: { value: formData.email, error: emailValidation.message || '', touched: true },
        password: { value: formData.password, error: passwordValidation.message || '', touched: true }
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // 检查用户角色，如果是管理员则重定向到管理后台
        if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        setError(data.error || '登录失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // 实时验证
    if (name === 'email') {
      setFieldValidations(prev => ({
        ...prev,
        email: updateFieldValidation(prev.email, value, validateEmailOrPhone)
      }))
    } else if (name === 'password') {
      setFieldValidations(prev => ({
        ...prev,
        password: updateFieldValidation(prev.password, value, validatePassword)
      }))
    }
  }

  const getFieldError = (fieldName: keyof typeof fieldValidations) => {
    const field = fieldValidations[fieldName]
    return field.touched && field.error ? field.error : ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* 小米风格的顶部导航 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Mi</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">Xiaomi Store</span>
                </Link>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <Link href="/support" className="hover:text-orange-500 transition-colors">Help Center</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white font-bold text-2xl">Mi</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign in to Xiaomi Account
              </h2>
              <p className="text-gray-600">
                Sign in to enjoy more services and offers
              </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email/Phone
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    getFieldError('email') 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-orange-500'
                  }`}
                  placeholder="Enter your email or phone number"
                />
                {getFieldError('email') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                      getFieldError('password') 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-200 focus:ring-orange-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {getFieldError('password') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <Link href="/forgot-password" className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have a Xiaomi account?{' '}
                  <Link href="/register" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
                    Sign up now
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer information */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>By signing in, you agree to Xiaomi's</p>
              <div className="mt-1 space-x-4">
                <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}