'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { syne, inter } from '@/lib/fonts';
import '../globals.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  return (
    <html lang="fr" className={`${syne.variable} ${inter.variable}`}>
      <body className="font-inter antialiased">
        <AdminAuthProvider>
          {isLoginPage ? (
            <div className="min-h-screen bg-navy-900 font-inter">{children}</div>
          ) : (
            <div className="flex min-h-screen bg-surface font-inter text-dark">
              <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
              </div>
            </div>
          )}
        </AdminAuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
