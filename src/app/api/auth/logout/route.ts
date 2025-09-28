import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    message: '登出成功'
  })

  // 清除cookie（同时清除通用 token 与管理员 token）
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  return response
}