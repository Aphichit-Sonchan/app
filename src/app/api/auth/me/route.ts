import { NextRequest, NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';
import { ApiResponse } from '@/lib/types/api';
import { User } from '@/app/data/mockData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '1'; // Default to admin for testing

    const user = serverRepository.getUserById(userId);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบข้อมูลผู้ใช้' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
