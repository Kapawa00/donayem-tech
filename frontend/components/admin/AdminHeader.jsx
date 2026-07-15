'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getInitials } from '@/lib/utils';

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/devis': 'Devis',
  '/admin/services': 'Services',
  '/admin/portfolio': 'Portfolio',
  '/admin/blog': 'Blog',
  '/admin/paiements': 'Paiements',
  '/admin/messages': 'Messages',
  '/admin/settings': 'Paramètres',
};

export default function AdminHeader({ onOpenSidebar }) {
  const pathname = usePathname();
  const { user } = useAdminAuth();

  const title =
    Object.entries(PAGE_TITLES).find(
      ([href]) => pathname === href || pathname.startsWith(`${href}/`)
    )?.[1] ?? 'Administration';

  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Ouvrir le menu"
          className="text-muted transition-colors hover:text-dark md:hidden"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-syne text-lg font-bold text-navy-900">{title}</h1>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-syne text-sm font-bold text-white">
        {getInitials(user?.name)}
      </div>
    </header>
  );
}
