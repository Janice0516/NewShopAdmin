// 表单验证工具函数
import { useState } from 'react'

export interface ValidationResult {
  isValid: boolean
  message?: string
}

// 商品数据验证规则
export interface ProductValidationRules {
  name: {
    required: boolean
    minLength: number
    maxLength: number
  }
  description: {
    maxLength: number
  }
  price: {
    required: boolean
    min: number
    max: number
    precision: number
  }
  stock: {
    required: boolean
    min: number
    max: number
    integer: boolean
  }
  categoryId: {
    required: boolean
  }
  images: {
    maxCount: number
    maxSize: number // MB
    allowedTypes: string[]
  }
}

// 默认商品验证规则
export const defaultProductRules: ProductValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  description: {
    maxLength: 1000
  },
  price: {
    required: true,
    min: 0.01,
    max: 999999.99,
    precision: 2
  },
  stock: {
    required: true,
    min: 0,
    max: 999999,
    integer: true
  },
  categoryId: {
    required: true
  },
  images: {
    maxCount: 10,
    maxSize: 5, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  }
}

// 商品验证结果接口
export interface ProductValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

// 商品数据验证函数
export function validateProduct(data: any, rules: ProductValidationRules = defaultProductRules): ProductValidationResult {
  const errors: Record<string, string[]> = {}

  // 验证商品名称
  if (rules.name.required && (!data.name || data.name.trim() === '')) {
    errors.name = errors.name || []
    errors.name.push('商品名称不能为空')
  }
  
  if (data.name && data.name.length < rules.name.minLength) {
    errors.name = errors.name || []
    errors.name.push(`商品名称至少需要${rules.name.minLength}个字符`)
  }
  
  if (data.name && data.name.length > rules.name.maxLength) {
    errors.name = errors.name || []
    errors.name.push(`商品名称不能超过${rules.name.maxLength}个字符`)
  }

  // 验证商品描述
  if (data.description && data.description.length > rules.description.maxLength) {
    errors.description = errors.description || []
    errors.description.push(`商品描述不能超过${rules.description.maxLength}个字符`)
  }

  // 验证价格
  if (rules.price.required && (!data.price || data.price === '')) {
    errors.price = errors.price || []
    errors.price.push('商品价格不能为空')
  }
  
  const price = parseFloat(data.price)
  if (data.price && (isNaN(price) || price < rules.price.min)) {
    errors.price = errors.price || []
    errors.price.push(`商品价格不能低于${rules.price.min}元`)
  }
  
  if (data.price && price > rules.price.max) {
    errors.price = errors.price || []
    errors.price.push(`商品价格不能超过${rules.price.max}元`)
  }
  
  // 验证价格精度
  if (data.price && price > 0) {
    const decimalPlaces = (price.toString().split('.')[1] || '').length
    if (decimalPlaces > rules.price.precision) {
      errors.price = errors.price || []
      errors.price.push(`价格小数位数不能超过${rules.price.precision}位`)
    }
  }

  // 验证库存
  if (rules.stock.required && (data.stock === undefined || data.stock === null || data.stock === '')) {
    errors.stock = errors.stock || []
    errors.stock.push('商品库存不能为空')
  }
  
  const stock = parseInt(data.stock)
  if (data.stock !== undefined && data.stock !== null && data.stock !== '') {
    if (isNaN(stock) || stock < rules.stock.min) {
      errors.stock = errors.stock || []
      errors.stock.push(`商品库存不能少于${rules.stock.min}`)
    }
    
    if (stock > rules.stock.max) {
      errors.stock = errors.stock || []
      errors.stock.push(`商品库存不能超过${rules.stock.max}`)
    }
    
    if (rules.stock.integer && !Number.isInteger(stock)) {
      errors.stock = errors.stock || []
      errors.stock.push('商品库存必须是整数')
    }
  }

  // 验证分类
  if (rules.categoryId.required && (!data.categoryId || data.categoryId.trim() === '')) {
    errors.categoryId = errors.categoryId || []
    errors.categoryId.push('请选择商品分类')
  }

  // 验证图片
  if (data.images && Array.isArray(data.images)) {
    if (data.images.length > rules.images.maxCount) {
      errors.images = errors.images || []
      errors.images.push(`图片数量不能超过${rules.images.maxCount}张`)
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// 文件验证函数
export function validateFile(file: File, rules: ProductValidationRules['images'] = defaultProductRules.images): ProductValidationResult {
  const errors: Record<string, string[]> = {}

  // 验证文件类型
  if (!rules.allowedTypes.includes(file.type)) {
    errors.file = errors.file || []
    errors.file.push(`不支持的文件类型，仅支持: ${rules.allowedTypes.join(', ')}`)
  }

  // 验证文件大小
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > rules.maxSize) {
    errors.file = errors.file || []
    errors.file.push(`文件大小不能超过${rules.maxSize}MB`)
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'Please enter your email address' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' }
  }
  
  return { isValid: true }
}

// Phone number validation (China mainland)
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: 'Please enter your phone number' }
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number' }
  }
  
  return { isValid: true }
}

// Email or phone number validation
export const validateEmailOrPhone = (input: string): ValidationResult => {
  if (!input) {
    return { isValid: false, message: 'Please enter your email or phone number' }
  }
  
  // Check if it's a phone number format
  if (/^\d+$/.test(input)) {
    return validatePhone(input)
  }
  
  // Otherwise validate as email
  return validateEmail(input)
}

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Please enter your password' }
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' }
  }
  
  if (password.length > 20) {
    return { isValid: false, message: 'Password cannot exceed 20 characters' }
  }
  
  // Check if it contains at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  if (!hasLetter || !hasNumber) {
    return { isValid: false, message: 'Password must contain both letters and numbers' }
  }
  
  return { isValid: true }
}

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' }
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' }
  }
  
  return { isValid: true }
}

// Name validation
export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, message: 'Please enter your name' }
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' }
  }
  
  if (name.trim().length > 20) {
    return { isValid: false, message: 'Name cannot exceed 20 characters' }
  }
  
  // Check for special characters (allow Chinese, English, spaces)
  const nameRegex = /^[\u4e00-\u9fa5a-zA-Z\s]+$/
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, message: 'Name can only contain letters and spaces' }
  }
  
  return { isValid: true }
}

// 实时验证状态类型
export interface FieldValidation {
  value: string
  error: string
  touched: boolean
}

// 创建字段验证状态
export const createFieldValidation = (initialValue: string = ''): FieldValidation => ({
  value: initialValue,
  error: '',
  touched: false
})

// 更新字段验证状态
export const updateFieldValidation = (
  field: FieldValidation,
  value: string,
  validator: (value: string) => ValidationResult
): FieldValidation => {
  const validation = validator(value)
  return {
    value,
    error: validation.isValid ? '' : (validation.message || ''),
    touched: true
  }
}