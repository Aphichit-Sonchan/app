'use client';

import { ReactNode, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

// Toast Context สำหรับแจ้งเตือน
export function Toast({ message, type }: ToastProps) {
  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' && '✓'}
      {type === 'error' && '✗'}
      {type === 'info' && 'ℹ'}
      {message}
    </div>
  );
}

// Custom hook สำหรับ Toast
export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (message: string, type: ToastProps['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const ToastComponent = toast ? <Toast message={toast.message} type={toast.type} /> : null;

  return { showToast, ToastComponent };
}

// AppLayout - wrapper สำหรับ Sidebar + Header + Content
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
