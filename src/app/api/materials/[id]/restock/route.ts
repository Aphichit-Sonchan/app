import { NextRequest, NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';
import { ApiResponse, RestockMaterialDto } from '@/lib/types/api';
import { Material } from '@/app/data/mockData';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as RestockMaterialDto;

    const addQty = Number(body.addQuantity);
    if (!addQty || addQty <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'กรุณาระบุจำนวนที่ต้องการเติมสต็อกที่มากกว่า 0' },
        { status: 400 }
      );
    }

    const restocked = serverRepository.restockMaterial(
      id,
      addQty,
      body.reason || 'เติมสต็อกตามรอบสั่งซื้อ',
      body.userName
    );

    if (!restocked) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบวัสดุที่ต้องการเติมสต็อก' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Material>>({
      success: true,
      message: `เติมสต็อกสำเร็จ (+${addQty} ${restocked.unit})`,
      data: restocked,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเติมสต็อก';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
