import { NextRequest, NextResponse } from 'next/server';
import { serverRepository } from '@/lib/server/repository';
import { ApiResponse, LoginRequestDto, LoginResponseDto } from '@/lib/types/api';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginRequestDto & { email?: string; identifier?: string };
    const identifier = body.username || body.email || body.identifier;

    if (!identifier) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'กรุณาระบุอีเมลหรือชื่อผู้ใช้งาน' },
        { status: 400 }
      );
    }

    const user = serverRepository.getUserByUsernameOrEmail(identifier);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ไม่พบบัญชีผู้ใช้งานหรืออีเมลนี้ในระบบ' },
        { status: 404 }
      );
    }

    if (user.status === 'ไม่ใช้งาน') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'บัญชีผู้ใช้นี้ถูกปิดการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' },
        { status: 403 }
      );
    }

    // Log Activity
    serverRepository.createActivityLog({
      userName: user.fullName,
      action: 'เข้าสู่ระบบ',
      description: `${user.fullName} (${user.role}) เข้าสู่ระบบสำเร็จ`,
      module: 'ระบบ',
      type: 'เข้าสู่ระบบ',
    });

    const responseData: LoginResponseDto = {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        department: user.department,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        phone: user.phone,
      },
    };

    return NextResponse.json<ApiResponse<LoginResponseDto>>({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: responseData,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
    return NextResponse.json<ApiResponse>(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
