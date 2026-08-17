import { NextRequest, NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';
import { ApiResponse, CancelRequestDto } from '@/lib/types/api';
import { EnhancedRequest } from '@/app/data/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: CancelRequestDto = {};
    try {
      body = (await req.json()) as CancelRequestDto;
    } catch {
      // Body optional
    }

    const cancelled = serverRepository.cancelRequest(id, body.userName);

    if (!cancelled) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบคำขอที่ต้องการยกเลิก' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<EnhancedRequest>>({
      success: true,
      message: `ยกเลิกคำขอ ${cancelled.requestCode} เรียบร้อยแล้ว`,
      data: cancelled,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการยกเลิกคำขอ';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
