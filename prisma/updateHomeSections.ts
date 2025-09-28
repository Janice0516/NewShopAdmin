import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.homeSection.findMany();

  for (const section of sections) {
    await prisma.homeSection.update({
      where: { id: section.id },
      data: {
        buttonText: 'View More',
        buttonLink: '#',
      },
    });
  }

  console.log('Successfully updated home sections.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });