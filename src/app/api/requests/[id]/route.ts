import { NextRequest, NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';
import { ApiResponse } from '@/lib/types/api';
import { EnhancedRequest } from '@/app/data/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const request = serverRepository.getRequestById(id);

    if (!request) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบข้อมูลคำขอ' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<EnhancedRequest>>({
      success: true,
      data: request,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอ';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
