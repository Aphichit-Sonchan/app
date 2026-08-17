import { NextRequest, NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';
import { ApiResponse, RejectRequestDto } from '@/lib/types/api';
import { EnhancedRequest } from '@/app/data/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as RejectRequestDto;

    if (!body.reason || body.reason.trim() === '') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'กรุณาระบุเหตุผลในการไม่อนุมัติคำขอ' },
        { status: 400 }
      );
    }

    const rejected = serverRepository.rejectRequest(id, body.reason, body.approverName);

    if (!rejected) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบคำขอที่ต้องการปฏิเสธ' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<EnhancedRequest>>({
      success: true,
      message: `บันทึกการไม่อนุมัติคำขอ ${rejected.requestCode} พร้อมระบุเหตุผลเรียบร้อยแล้ว`,
      data: rejected,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการไม่อนุมัติคำขอ';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
