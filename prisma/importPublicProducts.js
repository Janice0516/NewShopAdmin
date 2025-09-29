/*
 * Import public product images into Prisma Product records
 * Usage: node prisma/importPublicProducts.js
 * Requirements: DATABASE_URL env set (MySQL). The script upserts categories and products.
 */

const fs = require('fs')
const path = require('path')
// 加载 .env（如果存在），以便脚本能读取 DATABASE_URL
try {
  const dotenvPath = path.join(__dirname, '..', '.env')
  if (fs.existsSync(dotenvPath)) {
    require('dotenv').config({ path: dotenvPath })
    console.log('[INFO] .env loaded from', dotenvPath)
  } else {
    // 同时尝试默认位置
    require('dotenv').config()
  }
} catch (e) {
  console.warn('[WARN] dotenv load failed:', e?.message || e)
}
const { PrismaClient } = require('@prisma/client')

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('[ERROR] DATABASE_URL is not set. Please configure your database connection.')
    process.exit(1)
  }

  const prisma = new PrismaClient()
  const publicDir = path.join(__dirname, '..', 'public')

  // Read files in /public (one level only)
  const entries = fs.readdirSync(publicDir, { withFileTypes: true })
  const imageFiles = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((n) => /\.(webp|png|jpg|jpeg)$/i.test(n))

  // Helper: convert filename to readable product name
  function filenameToName(filename) {
    const base = filename.replace(/\.[^.]+$/, '') // remove extension
    const trimmed = base.trim().replace(/[_-]+/g, ' ')
    // Insert space before capital letters in camel case sequences
    const spaced = trimmed.replace(/([a-z])([A-Z])/g, '$1 $2')
    // Special fixes
    return spaced
      .replace(/RedMi/g, 'RedMi')
      .replace(/XiaoMi/g, 'Xiaomi')
      .replace(/MiRobot/g, 'Mi Robot')
      .replace(/([0-9])([A-Za-z])/g, '$1 $2')
      .replace(/\s+/g, ' ') // collapse spaces
      .trim()
  }

  // Determine category key by keywords
  function guessCategoryKey(name) {
    const n = name.toLowerCase()
    const wearable = ['watch', 'band']
    const smartHome = ['camera', 'robot', 'vacuum', 'scooter', 'pet', 'feeder', 'smart', 'outdoor']
    const lifestyle = ['sunglasses', 'straw', 'mug', 'cable', 'hair', 'dryer']

    if (wearable.some((k) => n.includes(k))) return 'wearable'
    if (smartHome.some((k) => n.includes(k))) return 'smart_home'
    if (lifestyle.some((k) => n.includes(k))) return 'life_style'
    // default
    return 'life_style'
  }

  const categoryNameByKey = {
    wearable: '穿戴设备/手表',
    smart_home: '智能家居',
    life_style: '生活用品',
  }

  console.log(`[INFO] Found ${imageFiles.length} image files in /public`)

  // Upsert categories first
  const categoryIds = {}
  for (const key of Object.keys(categoryNameByKey)) {
    const name = categoryNameByKey[key]
    const code = key
    const cat = await prisma.category.upsert({
      where: { name },
      update: { code },
      create: { name, code, isActive: true, sort: 0 },
      select: { id: true, name: true, code: true },
    })
    categoryIds[key] = cat.id
    console.log(`[OK] Category ready: ${cat.name} (${cat.code}) => ${cat.id}`)
  }

  const results = []

  for (const file of imageFiles) {
    const imagePath = `/${file.trim()}` // Next.js public path，去除文件名中意外的空格
    const name = filenameToName(file)
    const categoryKey = guessCategoryKey(name)
    const categoryId = categoryIds[categoryKey]
    const imagesJson = JSON.stringify([imagePath])

    try {
      const product = await prisma.product.upsert({
        where: { name },
        update: {
          images: imagesJson,
          categoryId,
          isActive: true,
        },
        create: {
          name,
          description: null,
          price: 0,
          originalPrice: null,
          images: imagesJson,
          stock: 0,
          sold: 0,
          categoryId,
          specs: null,
          isActive: true,
          isFeatured: false,
        },
        select: { id: true, name: true },
      })
      results.push({ file, name, categoryKey, productId: product.id })
      console.log(`[OK] Upsert product: ${name} [${categoryKey}] -> ${product.id}`)
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err?.message || err)
      results.push({ file, name, categoryKey, error: String(err?.message || err) })
    }
  }

  await prisma.$disconnect()

  console.log('\n==== Import Summary ====')
  const success = results.filter((r) => !r.error)
  const failed = results.filter((r) => r.error)
  console.log(`Success: ${success.length}, Failed: ${failed.length}`)
  console.table(success.map((s) => ({ name: s.name, category: s.categoryKey, id: s.productId })))
  if (failed.length) {
    console.table(failed.map((f) => ({ name: f.name, error: f.error })))
  }
}

main().catch((e) => {
  console.error('[FATAL]', e)
  process.exit(1)
})