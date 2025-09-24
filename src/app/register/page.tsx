'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { validateEmail, validatePassword, validateConfirmPassword, validateName, createFieldValidation, updateFieldValidation } from '@/utils/validation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [fieldValidations, setFieldValidations] = useState({
    name: createFieldValidation(),
    email: createFieldValidation(),
    password: createFieldValidation(),
    confirmPassword: createFieldValidation()
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate all fields
    const nameValidation = validateName(formData.name)
    const emailValidation = validateEmail(formData.email)
    const passwordValidation = validatePassword(formData.password)
    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword)

    if (!nameValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid || !confirmPasswordValidation.isValid) {
      setFieldValidations({
        name: { value: formData.name, error: nameValidation.message || '', touched: true },
        email: { value: formData.email, error: emailValidation.message || '', touched: true },
        password: { value: formData.password, error: passwordValidation.message || '', touched: true },
        confirmPassword: { value: formData.confirmPassword, error: confirmPasswordValidation.message || '', touched: true }
      })
      setLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/lottery') // Redirect to lottery page after successful registration
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('Network error, please try again later')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })

      // Real-time validation
      if (name === 'name') {
        setFieldValidations(prev => ({
          ...prev,
          name: updateFieldValidation(prev.name, value, validateName)
        }))
      } else if (name === 'email') {
        setFieldValidations(prev => ({
          ...prev,
          email: updateFieldValidation(prev.email, value, validateEmail)
        }))
      } else if (name === 'password') {
        setFieldValidations(prev => ({
          ...prev,
          password: updateFieldValidation(prev.password, value, validatePassword),
          // Also validate confirm password
          confirmPassword: prev.confirmPassword.touched 
            ? updateFieldValidation(prev.confirmPassword, formData.confirmPassword, (val) => validateConfirmPassword(value, val))
            : prev.confirmPassword
        }))
      } else if (name === 'confirmPassword') {
        setFieldValidations(prev => ({
          ...prev,
          confirmPassword: updateFieldValidation(prev.confirmPassword, value, (val) => validateConfirmPassword(formData.password, val))
        }))
      }
    }
  }

  const getFieldError = (fieldName: keyof typeof fieldValidations) => {
    const field = fieldValidations[fieldName]
    return field.touched && field.error ? field.error : ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Xiaomi-style top navigation */}
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
                <Link href="/login" className="hover:text-orange-500 transition-colors">Sign In</Link>
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
                Create Xiaomi Account
              </h2>
              <p className="text-gray-600">
                Join Xiaomi to enjoy exclusive services and offers
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    getFieldError('name') ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter your full name"
                />
                {getFieldError('name') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
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
                    getFieldError('email') ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email address"
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    getFieldError('password') ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Create a strong password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    getFieldError('confirmPassword') ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {getFieldError('confirmPassword') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-700">
                  I agree to Xiaomi's{' '}
                  <Link href="/terms" className="text-orange-500 hover:text-orange-600 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-orange-500 hover:text-orange-600 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.agreeToTerms}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                loading || !formData.agreeToTerms
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have a Xiaomi account?{' '}
                <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
                  Sign in now
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom information */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>By creating an account, you agree to Xiaomi's Terms of Service and Privacy Policy</p>
            <div className="mt-2 text-gray-400">
              <p>Your Xiaomi account works across all Xiaomi products and services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}