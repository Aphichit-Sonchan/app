'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAppStore } from '../data/store';

interface AccessDeniedProps {
  requiredRoles: string[];
  moduleName: string;
}

export default function AccessDenied({ requiredRoles, moduleName }: AccessDeniedProps) {
  const { currentUser } = useAppStore();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
          border: '1px solid #fee2e2',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <ShieldAlert size={38} />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>
          ไม่มีสิทธิ์เข้าถึงหน้านี้
        </h2>

        <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
          คุณไม่มีสิทธิ์ในการเข้าใช้งานหรือจัดการในโมดูล <strong style={{ color: '#111827' }}>&ldquo;{moduleName}&rdquo;</strong>
        </p>

        <div
          style={{
            background: '#f9fafb',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left',
            fontSize: '13px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6b7280' }}>บทบาทของคุณปัจจุบัน:</span>
            <span className="badge badge-staff" style={{ fontWeight: 600 }}>{currentUser.role}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280' }}>บทบาทที่อนุญาต:</span>
            <span style={{ color: '#1e40af', fontWeight: 600 }}>{requiredRoles.join(' หรือ ')}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <ArrowLeft size={16} /> กลับสู่หน้าหลัก
          </Link>
          <Link href="/login" className="btn btn-outline" style={{ padding: '10px 20px' }}>
            <LogOut size={16} /> สลับบัญชีผู้ใช้
          </Link>
        </div>
      </div>
    </div>
  );
}
