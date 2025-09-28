import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 获取单个栏目
export async function GET(request: Request, context: any) {
  try {
    const section = await prisma.homeSection.findUnique({
      where: { id: context?.params?.id as string },
    });
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 });
  }
}

// PUT - 更新栏目
export async function PUT(request: Request, context: any) {
  try {
    const data = await request.json();
    const updatedSection = await prisma.homeSection.update({
      where: { id: context?.params?.id as string },
      data,
    });
    return NextResponse.json(updatedSection);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

// DELETE - 删除栏目
export async function DELETE(request: Request, context: any) {
  try {
    await prisma.homeSection.delete({
      where: { id: context?.params?.id as string },
    });
    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}