import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// 生成JWT token
export function generateToken(payload: JWTPayload): string {
  console.log('生成token，payload:', payload, 'JWT_SECRET:', JWT_SECRET)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  console.log('Token生成完成，长度:', token.length)
  return token
}

// 验证JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log('开始验证token，JWT_SECRET:', JWT_SECRET ? '已设置' : '未设置')
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    console.log('Token验证成功:', decoded)
    return decoded
  } catch (error) {
    console.error('Token验证失败:', error)
    return null
  }
}

// 从请求中获取用户信息
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('admin_token')?.value ||
                request.cookies.get('token')?.value

  console.log('获取到的token:', token ? '存在' : '不存在')
  
  if (!token) {
    console.log('未找到token')
    return null
  }

  const user = verifyToken(token)
  console.log('解析用户信息:', user ? `用户ID: ${user.userId}, 角色: ${user.role}` : '解析失败')
  
  return user
}

// 检查用户权限
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'USER': 0,
    'ADMIN': 1,
    'SUPER_ADMIN': 2
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

  return userLevel >= requiredLevel
}