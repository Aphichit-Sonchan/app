'use client';

import AppLayout from './components/AppLayout';
import StatsCard from './components/StatsCard';
import { useAppStore } from './data/store';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  UserPlus,
  Package,
  FolderOpen,
  AlertTriangle,
  ClipboardCheck,
  TrendingUp,
  Send,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { monthlyReportData, departmentUsageData } from './data/mockData';

export default function DashboardPage() {
  const { users, categories, materials, requests, activityLogs, currentUser, switchRole } = useAppStore();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'ใช้งาน').length;
  const totalMaterials = materials.length;
  const totalCategories = categories.length;
  const pendingApprovals = requests.filter((r) => r.status === 'รออนุมัติ').length;
  const lowStockItems = materials.filter((m) => m.status === 'ใกล้หมด').length;
  const outOfStockItems = materials.filter((m) => m.status === 'หมดสต็อก').length;
  const borrowingItems = requests.filter((r) => r.status === 'กำลังยืม').length;
  const totalValue = materials.reduce((sum, m) => sum + m.totalValue, 0);

  const maxWithdrawals = Math.max(...monthlyReportData.map((d) => d.withdrawals));

  return (
    <AppLayout title="ระบบจัดการวัสดุเทศบาล">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>แดชบอร์ดภาพรวมระบบ</h1>
            <p>เทศบาลเมืองรังสิต • ยินดีต้อนรับคุณ {currentUser.fullName} ({currentUser.role})</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/requests" className="btn btn-primary">
              <Send size={16} /> ส่งคำขอเบิก–ยืม
            </Link>
            <Link href="/returns" className="btn btn-outline">
              <RotateCcw size={16} /> คืนอุปกรณ์
            </Link>
          </div>
        </div>
      </div>

      {/* Role Switcher Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f, #0f1724)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 25px rgba(15, 23, 36, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c4a35a, #d4b76a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#0f1724',
              fontWeight: 700,
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>
              ระบบแบ่งผู้ใช้งานออกเป็น 3 ระดับ
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
              คุณกำลังเข้าสู่ระบบในสิทธิ์: <strong style={{ color: '#93c5fd' }}>{currentUser.role}</strong> ({currentUser.fullName} - {currentUser.department})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn"
            style={{
              background: currentUser.role === 'ผู้ดูแลระบบ' ? '#2563eb' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: currentUser.role === 'ผู้ดูแลระบบ' ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.2)',
              fontSize: '12px',
              padding: '8px 14px',
            }}
            onClick={() => switchRole('ผู้ดูแลระบบ')}
          >
            1) แอดมิน (Admin)
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: currentUser.role === 'ผู้อนุมัติ' ? '#d97706' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: currentUser.role === 'ผู้อนุมัติ' ? '1px solid #fcd34d' : '1px solid rgba(255,255,255,0.2)',
              fontSize: '12px',
              padding: '8px 14px',
            }}
            onClick={() => switchRole('ผู้อนุมัติ')}
          >
            2) ผู้อนุมัติ (Approver)
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: currentUser.role === 'เจ้าหน้าที่' ? '#0d9488' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: currentUser.role === 'เจ้าหน้าที่' ? '1px solid #5eead4' : '1px solid rgba(255,255,255,0.2)',
              fontSize: '12px',
              padding: '8px 14px',
            }}
            onClick={() => switchRole('เจ้าหน้าที่')}
          >
            3) เจ้าหน้าที่ (Staff)
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          icon={<Users size={24} />}
          value={totalUsers}
          label="ผู้ใช้ทั้งหมดในระบบ"
          color="blue"
        />
        <StatsCard
          icon={<UserCheck size={24} />}
          value={activeUsers}
          label="ผู้ใช้ที่เปิดใช้งาน"
          color="green"
        />
        <StatsCard
          icon={<ClipboardCheck size={24} />}
          value={pendingApprovals}
          label="คำขอรอการอนุมัติ"
          color="purple"
        />
        <StatsCard
          icon={<Package size={24} />}
          value={totalMaterials}
          label="รายการวัสดุและครุภัณฑ์"
          color="orange"
        />
        <StatsCard
          icon={<FolderOpen size={24} />}
          value={totalCategories}
          label="หมวดหมู่วัสดุ"
          color="cyan"
        />
        <StatsCard
          icon={<RotateCcw size={24} />}
          value={borrowingItems}
          label="รายการที่กำลังยืมอยู่"
          color="red"
        />
      </div>

      {/* Charts and Action Boards */}
      <div className="dashboard-grid">
        {/* Monthly withdrawal chart */}
        <div className="card">
          <div className="card-header">
            <h2>📊 ยอดเบิกจ่ายรายเดือน (ปี 2569)</h2>
          </div>
          <div className="card-body">
            <div className="chart-placeholder">
              {monthlyReportData.map((data) => (
                <div key={data.month} className="chart-bar-container">
                  <span className="chart-bar-label">{data.month}</span>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        width: `${(data.withdrawals / maxWithdrawals) * 100}%`,
                        background: `linear-gradient(90deg, #3b82f6, #60a5fa)`,
                      }}
                    >
                      {data.withdrawals}
                    </div>
                  </div>
                  <span className="chart-bar-value">
                    ฿{(data.value / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Usage Pie */}
        <div className="card">
          <div className="card-header">
            <h2>🏢 สัดส่วนการใช้วัสดุแต่ละแผนก</h2>
          </div>
          <div className="card-body">
            <div className="pie-chart-container">
              <div
                className="pie-chart"
                style={{
                  background: `conic-gradient(
                    ${departmentUsageData[0].color} 0% ${departmentUsageData[0].percentage}%,
                    ${departmentUsageData[1].color} ${departmentUsageData[0].percentage}% ${departmentUsageData[0].percentage + departmentUsageData[1].percentage}%,
                    ${departmentUsageData[2].color} ${departmentUsageData[0].percentage + departmentUsageData[1].percentage}% ${departmentUsageData[0].percentage + departmentUsageData[1].percentage + departmentUsageData[2].percentage}%,
                    ${departmentUsageData[3].color} ${departmentUsageData[0].percentage + departmentUsageData[1].percentage + departmentUsageData[2].percentage}% ${departmentUsageData[0].percentage + departmentUsageData[1].percentage + departmentUsageData[2].percentage + departmentUsageData[3].percentage}%,
                    ${departmentUsageData[4].color} ${departmentUsageData[0].percentage + departmentUsageData[1].percentage + departmentUsageData[2].percentage + departmentUsageData[3].percentage}% 100%
                  )`,
                }}
              />
              <div className="pie-legend">
                {departmentUsageData.map((dept) => (
                  <div key={dept.department} className="pie-legend-item">
                    <div
                      className="pie-legend-color"
                      style={{ background: dept.color }}
                    />
                    <span className="pie-legend-text">{dept.department}</span>
                    <span className="pie-legend-value">{dept.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Needed Alerts */}
        <div className="card">
          <div className="card-header">
            <h2>⚠️ การแจ้งเตือนและการดำเนินงานด่วน</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/approvals"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--warning-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--warning-100)',
                }}
              >
                <ClipboardCheck size={20} style={{ color: 'var(--warning-600)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    คำขอเบิก–ยืม รอพิจารณาอนุมัติ
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    มี {pendingApprovals} รายการที่รอการอนุมัติจากผู้อนุมัติ
                  </div>
                </div>
                <span className="badge badge-warning">คลิกเพื่อดู</span>
              </Link>

              <Link
                href="/inventory"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--danger-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--danger-100)',
                }}
              >
                <AlertTriangle size={20} style={{ color: 'var(--danger-600)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    วัสดุใกล้หมดสต็อก
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    มี {lowStockItems} รายการต่ำกว่าเกณฑ์ขั้นต่ำ ต้องสั่งเติม
                  </div>
                </div>
                <span className="badge badge-danger">เติมสต็อก</span>
              </Link>

              <Link
                href="/returns"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--info-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--info-100)',
                }}
              >
                <RotateCcw size={20} style={{ color: 'var(--info-600)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    วัสดุและอุปกรณ์ที่อยู่ระหว่างยืม
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    มี {borrowingItems} รายการรอการส่งคืนเข้าคลัง
                  </div>
                </div>
                <span className="badge badge-info">บันทึกคืน</span>
              </Link>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--success-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--success-100)',
                }}
              >
                <TrendingUp size={20} style={{ color: 'var(--success-600)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    มูลค่าทรัพย์สินคลังวัสดุ
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    มูลค่ารวมทั้งสิ้น ฿{totalValue.toLocaleString('th-TH')} บาท
                  </div>
                </div>
                <span className="badge badge-success">ปกติ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🕐 กิจกรรมล่าสุดในระบบ</h2>
            <Link href="/history" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="activity-list">
            {activityLogs.slice(0, 5).map((log) => {
              const iconClass =
                log.type === 'สร้าง' ? 'create' :
                log.type === 'แก้ไข' ? 'edit' :
                log.type === 'ลบ' ? 'delete' :
                log.type === 'เข้าสู่ระบบ' ? 'login' :
                log.type === 'อนุมัติ' ? 'approve' :
                'withdraw';

              const iconEmoji =
                log.type === 'สร้าง' ? '➕' :
                log.type === 'แก้ไข' ? '✏️' :
                log.type === 'ลบ' ? '🗑️' :
                log.type === 'เข้าสู่ระบบ' ? '🔑' :
                log.type === 'อนุมัติ' ? '✅' :
                '📦';

              return (
                <div key={log.id} className="activity-item">
                  <div className={`activity-icon ${iconClass}`}>
                    {iconEmoji}
                  </div>
                  <div className="activity-info">
                    <h4>{log.action}</h4>
                    <p>{log.description}</p>
                  </div>
                  <div className="activity-meta">
                    <div className="time">{log.timestamp.split(' ').slice(0, 3).join(' ')}</div>
                    <div className="module">{log.module}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
