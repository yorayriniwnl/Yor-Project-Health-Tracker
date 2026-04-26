import { formatCurrency } from '@/lib/utils';
import { DashboardCharts } from './DashboardCharts';
import { StatCard } from './StatCard';
import { Activity, AlertTriangle, Banknote, CheckCircle2, ClipboardList, Gauge, HeartPulse, IndianRupee, Timer, Wrench } from 'lucide-react';

export function DashboardOverview() {
  const stats = [
    { title: 'Total projects', value: 69, subtitle: 'Across all departments', icon: ClipboardList },
    { title: 'Completed projects', value: 27, tone: 'blue' as const, icon: CheckCircle2 },
    { title: 'In-progress projects', value: 33, tone: 'purple' as const, icon: Activity },
    { title: 'Delayed projects', value: 12, tone: 'red' as const, icon: Timer },
    { title: 'Over-budget projects', value: 8, tone: 'yellow' as const, icon: AlertTriangle },
    { title: 'Critical projects', value: 9, tone: 'red' as const, icon: HeartPulse },
    { title: 'Total healthy projects', value: 42, tone: 'green' as const, icon: Gauge },
    { title: 'Budget allocated', value: formatCurrency(14900000000), icon: IndianRupee },
    { title: 'Budget spent', value: formatCurrency(8730000000), icon: Banknote },
    { title: 'Maintenance cost', value: formatCurrency(612000000), icon: Wrench },
    { title: 'Avg. contractor success', value: '82%', icon: CheckCircle2, tone: 'green' as const }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Main Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Budget, timeline, progress, broker risk, contractor performance, and health summary.</p>
        </div>
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft">Export dashboard</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>
      <DashboardCharts />
    </div>
  );
}
