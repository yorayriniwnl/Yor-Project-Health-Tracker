'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Banknote, CheckCircle2, ClipboardList, Gauge, HeartPulse, IndianRupee, Timer, Wrench } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { HealthDistributionChart } from '@/components/dashboard/HealthDistributionChart';
import { BudgetChart } from '@/components/dashboard/BudgetChart';
import { ContractorRanking } from '@/components/dashboard/ContractorRanking';
import { fetcher } from '@/lib/api';
import { formatCurrency, percent } from '@/lib/utils';

export default function DashboardPage() {
  const { data: summary } = useQuery({ queryKey: ['dashboard-summary'], queryFn: () => fetcher<any>('/dashboard/summary') });
  const { data: health } = useQuery({ queryKey: ['dashboard-health'], queryFn: () => fetcher<any[]>('/dashboard/project-health') });
  const { data: budget } = useQuery({ queryKey: ['dashboard-budget'], queryFn: () => fetcher<any[]>('/dashboard/budget-summary') });
  const { data: contractors } = useQuery({ queryKey: ['dashboard-contractors'], queryFn: () => fetcher<any[]>('/dashboard/contractor-performance') });

  return (
    <AppShell>
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Dashboard</h1><p className="text-sm text-slate-500">Portfolio overview for budget, progress, timelines, health, contractors, and maintenance.</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total projects" value={summary?.totalProjects ?? 0} icon={ClipboardList} />
        <StatCard title="Completed projects" value={summary?.completedProjects ?? 0} icon={CheckCircle2} tone="green" />
        <StatCard title="Delayed projects" value={summary?.delayedProjects ?? 0} icon={Timer} tone="red" />
        <StatCard title="Critical projects" value={summary?.criticalProjects ?? 0} icon={AlertTriangle} tone="red" />
        <StatCard title="Total healthy projects" value={summary?.totalHealthyProjects ?? 0} icon={HeartPulse} tone="green" />
        <StatCard title="Budget allocated" value={formatCurrency(summary?.totalBudgetAllocated)} icon={IndianRupee} tone="blue" />
        <StatCard title="Budget spent" value={formatCurrency(summary?.totalBudgetSpent)} icon={Banknote} tone="yellow" />
        <StatCard title="Maintenance cost" value={formatCurrency(summary?.totalMaintenanceCost)} icon={Wrench} tone="purple" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <HealthDistributionChart data={health} />
        <div className="xl:col-span-2"><BudgetChart data={budget} /></div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ContractorRanking data={contractors} />
        <div className="gov-card p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-900">Portfolio health notes</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-emerald-700">Average contractor success</p><p className="mt-2 text-2xl font-bold text-emerald-900">{percent(summary?.averageContractorSuccessRate)}</p></div>
            <div className="rounded-2xl bg-amber-50 p-4"><p className="text-sm text-amber-700">Over-budget projects</p><p className="mt-2 text-2xl font-bold text-amber-900">{summary?.overBudgetProjects ?? 0}</p></div>
            <div className="rounded-2xl bg-indigo-50 p-4"><p className="text-sm text-indigo-700">In-progress projects</p><p className="mt-2 text-2xl font-bold text-indigo-900">{summary?.inProgressProjects ?? 0}</p></div>
          </div>
          <p className="mt-4 text-sm text-slate-500"><Gauge className="mr-1 inline h-4 w-4" /> Health score is calculated from budget, timeline, progress, contractor record, maintenance sustainability, and broker compliance risk.</p>
        </div>
      </div>
    </AppShell>
  );
}
