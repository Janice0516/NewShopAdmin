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
  // 优化数据库连接池配置
  connectionLimit: 20, // 增加连接池大小
  transactionOptions: {
    maxWait: 5000, // 最大等待时间5秒
    timeout: 10000, // 事务超时时间10秒
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma