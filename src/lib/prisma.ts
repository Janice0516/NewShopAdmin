import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // 优化事务配置
  transactionOptions: {
    maxWait: 5000, // 最大等待时间5秒
    timeout: 10000, // 事务超时时间10秒
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma