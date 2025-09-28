import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 获取所有栏目
export async function GET(): Promise<NextResponse> {
  console.log('GET /api/home-sections called');
  try {
    const sections = await prisma.homeSection.findMany();
    return NextResponse.json(sections);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST - 创建新栏目
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();
    const newSection = await prisma.homeSection.create({
      data,
    });
    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error); // Log any errors
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}