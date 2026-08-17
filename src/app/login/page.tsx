'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Users, Lock, User as UserIcon, ArrowRight, CheckCircle } from 'lucide-react';
import { useAppStore } from '../data/store';

export default function LoginPage() {
  const router = useRouter();
  const { users, setCurrentUser, switchRole } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError('กรุณากรอกชื่อผู้ใช้');
      return;
    }

    const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (found) {
      setCurrentUser(found);
      router.push('/');
    } else {
      // Fallback: login as first user
      setCurrentUser(users[0]);
      router.push('/');
    }
  };

  const handleQuickLogin = (role: 'ผู้ดูแลระบบ' | 'ผู้อนุมัติ' | 'เจ้าหน้าที่') => {
    switchRole(role);
    router.push('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1724 0%, #1a2332 50%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a5f, #0f1724)',
            padding: '36px 32px',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #c4a35a, #d4b76a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px',
              boxShadow: '0 8px 16px rgba(196, 163, 90, 0.3)',
            }}
          >
            🏛️
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px' }}>เทศบาลเมืองรังสิต</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
            ระบบจัดการวัสดุและครุภัณฑ์เทศบาล
          </p>
        </div>

        {/* Body Form */}
        <div style={{ padding: '32px' }}>
          <form onSubmit={handleLogin}>
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label>ชื่อผู้ใช้งาน (Username)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="เช่น somchai.j"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  style={{ paddingLeft: '40px' }}
                />
                <UserIcon
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>รหัสผ่าน (Password)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px', justifyContent: 'center', marginTop: '8px' }}
            >
              เข้าสู่ระบบ <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Access for 3 Roles */}
          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '12px', textAlign: 'center' }}>
              หรือเลือกเข้าสู่ระบบด่วนตามบทบาท (3 ระดับ):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleQuickLogin('ผู้ดูแลระบบ')}
                style={{
                  justifyContent: 'flex-start',
                  padding: '10px 14px',
                  borderColor: '#93c5fd',
                  background: '#eff6ff',
                }}
              >
                <ShieldCheck size={18} style={{ color: '#2563eb' }} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>
                    1) ผู้ดูแลระบบ (Administrator)
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    สมชาย ใจดี • จัดการผู้ใช้, หมวดหมู่, สิทธิ์, วัสดุ, สต็อก
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleQuickLogin('ผู้อนุมัติ')}
                style={{
                  justifyContent: 'flex-start',
                  padding: '10px 14px',
                  borderColor: '#fde68a',
                  background: '#fffbeb',
                }}
              >
                <UserCheck size={18} style={{ color: '#d97706' }} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
                    2) ผู้อนุมัติ (Approver)
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    ประยุทธ์ มั่นคง • ตรวจสอบคำขอเบิก–ยืม, อนุมัติ/ไม่อนุมัติ
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleQuickLogin('เจ้าหน้าที่')}
                style={{
                  justifyContent: 'flex-start',
                  padding: '10px 14px',
                  borderColor: '#99f6e4',
                  background: '#f0fdfa',
                }}
              >
                <Users size={18} style={{ color: '#0d9488' }} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#115e59' }}>
                    3) เจ้าหน้าที่ผู้ใช้งาน (Staff)
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    วันทนา สุขกมล • ค้นหาวัสดุ, ส่งคำขอเบิก/ยืม, บันทึกคืน
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
