import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getHomeSections() {
  const sections = await prisma.homeSection.findMany();
  return sections;
}