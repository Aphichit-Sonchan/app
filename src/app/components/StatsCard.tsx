'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  color: 'blue' | 'green' | 'red' | 'orange' | 'cyan' | 'purple';
}

export default function StatsCard({ icon, value, label, color }: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className={`stats-card-icon ${color}`}>
        {icon}
      </div>
      <div className="stats-card-info">
        <h3>{typeof value === 'number' ? value.toLocaleString('th-TH') : value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}
