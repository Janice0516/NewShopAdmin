
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Upsert categories（追加中文分类，保留原有示例分类）
  const categories = [
    { name: 'Electronics', description: 'All kinds of electronic products', image: 'https://i.imgur.com/nJ4sVqM.png' },
    { name: 'Clothing', description: 'Fashionable clothing for all seasons', image: 'https://i.imgur.com/sA23V3N.png' },
    { name: 'Books', description: 'A wide range of books', image: 'https://i.imgur.com/yVd3b2d.png' },
    { name: 'Home Goods', description: 'Household items and decorations', image: 'https://i.imgur.com/Jg4g4v2.png' },
    { name: 'Sports', description: 'Equipment for various sports', image: 'https://i.imgur.com/bX3Yq2V.png' },
    { name: 'Toys', description: 'Fun toys for all ages', image: 'https://i.imgur.com/s3f2KqS.png' },
    { name: 'Groceries', description: 'Fresh and packaged food items', image: 'https://i.imgur.com/4Y2V3bN.png' },
    { name: 'Automotive', description: 'Car parts and accessories', image: 'https://i.imgur.com/sA23V3N.png' },
    { name: 'Health', description: 'Health and wellness products', image: 'https://i.imgur.com/yVd3b2d.png' },
    { name: 'Beauty', description: 'Cosmetics and beauty products', image: 'https://i.imgur.com/Jg4g4v2.png' },
    // 中文分类，支持前后端映射
    { name: '穿戴设备/手表', description: '手环、手表等穿戴类设备', image: 'https://i.imgur.com/nJ4sVqM.png' },
    { name: '智能家居', description: '智能门锁、摄像头、照明等智能家居产品', image: 'https://i.imgur.com/Jg4g4v2.png' },
    { name: '生活用品', description: '日用家居与生活用品', image: 'https://i.imgur.com/bX3Yq2V.png' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Upserted categories.');

  // 获取“穿戴设备/手表”分类，找不到则回退到 Electronics
  const wearableCategory = await prisma.category.findFirst({ where: { name: '穿戴设备/手表' } })
    || await prisma.category.findFirst({ where: { name: 'Electronics' } });

  if (!wearableCategory) {
    console.error('No target category found. Please seed categories first.');
    return;
  }

  // Create products（归属到穿戴分类）
  const products = [
    {
      name: 'Redmi Watch 5 Active',
      price: 299.00,
      images: JSON.stringify(['https://i02.appmifile.com/mi-com-product/fly-birds/redmi-watch-5-active/img/redmi-watch-5-active.jpg']),
      categoryId: wearableCategory.id,
    },
    {
      name: 'Xiaomi Smart Band 8',
      price: 79.00,
      images: JSON.stringify(['https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-smart-band-8/img/xiaomi-smart-band-8.jpg']),
      categoryId: wearableCategory.id,
    },
    {
      name: 'Xiaomi Watch S3',
      price: 129.99,
      images: JSON.stringify(['https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-watch-s3/img/xiaomi-watch-s3.jpg']),
      categoryId: wearableCategory.id,
    },
    {
      name: 'Xiaomi Watch 2',
      price: 169.99,
      images: JSON.stringify(['https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-watch-2/img/xiaomi-watch-2.jpg']),
      categoryId: wearableCategory.id,
    },
    {
      name: 'POCO Watch',
      price: 69.99,
      images: JSON.stringify(['https://i02.appmifile.com/mi-com-product/fly-birds/poco-watch/img/poco-watch.jpg']),
      categoryId: wearableCategory.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log('Upserted products.');

  // Create home sections
  const homeSections = [
    {
      title: 'Smart Electronics',
      subtitle: 'Discover the future of technology',
      imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/redmi-watch-5-active/img/redmi-watch-5-active.jpg',
      buttonText: 'Shop Now',
      buttonLink: '/products/electronics',
    },
    {
      title: 'Mobiles and Watches',
      subtitle: 'Stay connected with our latest devices',
      imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-watch-s3/img/xiaomi-watch-s3.jpg',
      buttonText: 'Explore',
      buttonLink: '/products/mobiles-watches',
    },
  ];

  for (const section of homeSections) {
    await prisma.homeSection.upsert({
      where: { title: section.title },
      update: {},
      create: section,
    });
  }

  console.log('Upserted home sections.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
