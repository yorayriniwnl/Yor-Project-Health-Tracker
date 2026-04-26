'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { fetcher } from '@/lib/api';
import type { Paginated, Project } from '@/types/project';
import { formatCurrency } from '@/lib/utils';

export default function MaintenancePage() {
  const { data } = useQuery({ queryKey: ['maintenance-projects'], queryFn: () => fetcher<Paginated<Project>>('/projects?limit=100&sortBy=annualMaintenanceCost&sortOrder=desc') });
  const projects = data?.items || [];
  return (
    <AppShell>
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Maintenance cost tracker</h1><p className="text-sm text-slate-500">Compare expected, actual, and annual maintenance cost against total project value.</p></div>
      <div className="gov-card overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Project</th><th className="px-4 py-3">Budget allocated</th><th className="px-4 py-3">Expected maintenance</th><th className="px-4 py-3">Actual maintenance</th><th className="px-4 py-3">Annual maintenance</th><th className="px-4 py-3">Cost %</th><th className="px-4 py-3">Risk</th></tr></thead>
          <tbody className="divide-y divide-slate-100 bg-white">{projects.map((p) => { const annual = Number(p.annualMaintenanceCost || p.expectedMaintenanceCost || 0); const pct = Number(p.budgetAllocated) ? (annual / Number(p.budgetAllocated)) * 100 : 0; return <tr key={p.id}><td className="px-4 py-3 font-semibold text-slate-900">{p.projectName}</td><td className="px-4 py-3">{formatCurrency(p.budgetAllocated)}</td><td className="px-4 py-3">{formatCurrency(p.expectedMaintenanceCost)}</td><td className="px-4 py-3">{formatCurrency(p.actualMaintenanceCost)}</td><td className="px-4 py-3">{formatCurrency(p.annualMaintenanceCost)}</td><td className="px-4 py-3 font-bold">{pct.toFixed(2)}%</td><td className="px-4 py-3">{pct > 10 ? 'High' : pct > 5 ? 'Medium' : 'Low'}</td></tr>; })}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
