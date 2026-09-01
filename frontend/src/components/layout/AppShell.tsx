'use client';

import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="yor-app min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <TopNavbar />
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
