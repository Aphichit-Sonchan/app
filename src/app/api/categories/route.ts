import { NextRequest, NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';
import { ApiResponse, CreateCategoryDto } from '@/lib/types/api';
import { Category } from '@/app/data/mockData';

export async function GET() {
  try {
    const categories = serverRepository.getCategories();
    return NextResponse.json<ApiResponse<Category[]>>({
      success: true,
      data: categories,
      total: categories.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateCategoryDto;

    if (!body.name) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'กรุณาระบุชื่อหมวดหมู่' },
        { status: 400 }
      );
    }

    const newCategory = serverRepository.createCategory(body);

    return NextResponse.json<ApiResponse<Category>>(
      {
        success: true,
        message: 'เพิ่มหมวดหมู่สำเร็จ',
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
