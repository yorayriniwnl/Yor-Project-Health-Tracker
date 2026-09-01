'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Building2, ClipboardList, FileText, Gauge, Home, Landmark, LogOut, ShieldCheck, Users, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStoredUser, logout } from '@/lib/auth';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: Gauge, roles: ['SUPER_ADMIN', 'GOVERNMENT_ADMIN', 'PROJECT_MANAGER', 'AUDITOR'] },
  { href: '/projects', label: 'Projects', icon: ClipboardList, roles: ['SUPER_ADMIN', 'GOVERNMENT_ADMIN', 'PROJECT_MANAGER', 'AUDITOR', 'CONTRACTOR'] },
  { href: '/contractors', label: 'Contractors', icon: Users, roles: ['SUPER_ADMIN', 'GOVERNMENT_ADMIN', 'AUDITOR'] },
  { href: '/brokers', label: 'Brokers', icon: ShieldCheck, roles: ['SUPER_ADMIN', 'GOVERNMENT_ADMIN', 'AUDITOR'] },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['SUPER_ADMIN', 'GOVERNMENT_ADMIN', 'PROJECT_MANAGER', 'AUDITOR'] },
  { href: '/reports', label: 'Reports', icon: FileText, roles: ['SUPER_ADMIN', 'GOVERNMENT_ADMIN', 'AUDITOR'] },
  { href: '/audit-logs', label: 'Audit Logs', icon: BarChart3, roles: ['SUPER_ADMIN', 'AUDITOR'] },
  { href: '/public-portal', label: 'Public Portal', icon: Landmark, roles: ['SUPER_ADMIN', 'GOVERNMENT_ADMIN', 'PROJECT_MANAGER', 'AUDITOR', 'CONTRACTOR', 'PUBLIC_VIEWER'] }
];

export function Sidebar() {
  const path = usePathname();
  const user = getStoredUser();
  const role = user?.role || 'SUPER_ADMIN';
  const visible = items.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-slate-200 bg-black lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-11 w-11 items-center justify-center border border-[#e84b4b] bg-[#671515] text-[#ff8a7f]"><Home className="h-5 w-5" /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#ff8a7f]">YOR / FIELD</p>
          <h1 className="text-base font-medium text-[#f5eaea]">Project Health</h1>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {visible.map((item) => {
          const Icon = item.icon;
          const active = path === item.href || path.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-medium transition', active ? 'border-[#e84b4b] bg-[#671515]/40 text-[#f5eaea]' : 'border-transparent text-slate-600 hover:border-[#ff8a7f] hover:bg-[#671515]/20 hover:text-slate-900')}>
              <Icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3 text-sm">
          <p className="font-semibold text-slate-900">{user?.fullName || 'Demo Officer'}</p>
          <p className="text-xs text-slate-500">{role.replaceAll('_', ' ')}</p>
        </div>
        <button onClick={() => { logout(); window.location.href = '/login'; }} className="mt-3 flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
