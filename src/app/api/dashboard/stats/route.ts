import { NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';
import { ApiResponse } from '@/lib/types/api';

export async function GET() {
  try {
    const stats = serverRepository.getDashboardStats();
    return NextResponse.json<ApiResponse<typeof stats>>({
      success: true,
      data: stats,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลสรุปแดชบอร์ด';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
