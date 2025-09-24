// 表单验证工具函数

export interface ValidationResult {
  isValid: boolean
  message?: string
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