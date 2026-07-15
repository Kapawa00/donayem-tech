'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PenTool,
  Quote,
  Settings,
  Settings2,
  X,
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import adminApi from '@/lib/adminAuth';
import { cn, getInitials } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/devis', label: 'Devis', icon: FileText, badgeKey: 'quotes' },
  { href: '/admin/services', label: 'Services', icon: Settings2 },
  { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
  { href: '/admin/blog', label: 'Blog', icon: PenTool },
  { href: '/admin/testimonials', label: 'Témoignages', icon: Quote },
  { href: '/admin/paiements', label: 'Paiements', icon: CreditCard },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, badgeKey: 'messages' },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const [badges, setBadges] = useState({ quotes: 0, messages: 0 });

  useEffect(() => {
    let active = true;

    async function fetchBadges() {
      try {
        const [statsRes, quotesRes] = await Promise.all([
          adminApi.get('/admin/dashboard/stats'),
          adminApi.get('/admin/quotes', { params: { status: 'new', per_page: 1 } }),
        ]);

        if (!active) return;

        setBadges({
          messages: statsRes.data?.data?.messages_unread ?? 0,
          quotes: quotesRes.data?.meta?.total ?? 0,
        });
      } catch (error) {
        // Badges non bloquants : on ignore silencieusement en cas d'échec.
      }
    }

    fetchBadges();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy-900/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-900 text-white transition-transform duration-300',
          'md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-5">
          <span className="font-syne text-base font-bold">
            DONAYEM<span className="text-gold-400"> TECH</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="text-gray-400 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-4">
          <span className="inline-flex items-center rounded-pill bg-gold-400/15 px-3 py-1 font-inter text-xs font-medium uppercase tracking-widest text-gold-400">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 font-inter text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gold-400/15 text-gold-500'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon size={18} />
                <span className="flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-pill bg-red-500 px-1.5 font-inter text-[11px] font-bold text-white">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 font-syne text-sm font-bold text-navy-900">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-inter text-sm font-medium text-white">{user?.name ?? '—'}</p>
              <p className="truncate font-inter text-xs text-gray-400">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 font-inter text-sm font-medium
                       text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
