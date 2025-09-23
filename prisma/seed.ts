import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建测试账户...')

  // 创建测试客户账户
  const testCustomer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      password: await hashPassword('123456'),
      name: '测试客户',
      role: 'USER',
      isNewUser: false,
    },
  })

  console.log('✅ 测试客户账户创建成功:', {
    id: testCustomer.id,
    email: testCustomer.email,
    name: testCustomer.name,
    role: testCustomer.role
  })

  // 创建测试管理员账户
  const testAdmin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: await hashPassword('admin123'),
      name: '测试管理员',
      role: 'ADMIN',
      isNewUser: false,
    },
  })

  console.log('✅ 测试管理员账户创建成功:', {
    id: testAdmin.id,
    email: testAdmin.email,
    name: testAdmin.name,
    role: testAdmin.role
  })

  console.log('\n🎉 所有测试账户创建完成！')
  console.log('\n📋 测试账户信息:')
  console.log('客户账户:')
  console.log('  邮箱: customer@test.com')
  console.log('  密码: 123456')
  console.log('  角色: USER')
  console.log('\n管理员账户:')
  console.log('  邮箱: admin@test.com')
  console.log('  密码: admin123')
  console.log('  角色: ADMIN')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ 创建测试账户时出错:', e)
    await prisma.$disconnect()
    process.exit(1)
  })