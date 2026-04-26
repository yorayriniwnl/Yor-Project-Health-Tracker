'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { fetcher } from '@/lib/api';

export default function ReportsPage() {
  const { data: critical } = useQuery({ queryKey: ['critical-report-preview'], queryFn: () => fetcher<any>('/reports/critical-projects') });
  return (
    <AppShell>
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Reports</h1><p className="text-sm text-slate-500">Generate health, budget, delay, contractor, broker, department, maintenance, and transparency reports.</p></div>
      <div className="grid gap-6 xl:grid-cols-3"><div className="xl:col-span-2"><ReportGenerator /></div><div className="gov-card p-5"><h3 className="font-bold text-slate-900">Critical projects preview</h3><p className="mt-2 text-3xl font-bold text-red-700">{critical?.length ?? 0}</p><p className="text-sm text-slate-500">Projects currently classified as critical.</p></div></div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{['Healthy projects report', 'Budget overrun report', 'Delayed project report', 'Contractor performance report', 'Broker risk report', 'Maintenance cost report', 'Department performance report', 'Public transparency report'].map((name) => <div key={name} className="gov-card p-4"><p className="font-semibold text-slate-900">{name}</p><p className="mt-1 text-sm text-slate-500">Date, department, location, contractor, and health filters supported.</p></div>)}</div>
    </AppShell>
  );
}
