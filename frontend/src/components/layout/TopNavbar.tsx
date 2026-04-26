'use client';

import Link from 'next/link';
import { Bell, Plus, Search } from 'lucide-react';
import { getStoredUser } from '@/lib/auth';

export function TopNavbar() {
  const user = getStoredUser();
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Administrative Control Center</p>
        <h2 className="text-xl font-bold text-slate-900">Government Project Health Tracker</h2>
      </div>
      <div className="hidden flex-1 justify-center px-8 md:flex">
        <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Search className="h-4 w-4" /> Search projects, contractors, brokers
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/projects/new" className="gov-button hidden sm:inline-flex"><Plus className="mr-2 h-4 w-4" /> New Project</Link>
        <button className="rounded-xl border border-slate-200 p-2 text-slate-600"><Bell className="h-5 w-5" /></button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{user?.fullName || 'Demo Officer'}</p>
          <p className="text-xs text-slate-500">{user?.role?.replaceAll('_', ' ') || 'SUPER ADMIN'}</p>
        </div>
      </div>
    </header>
  );
}
