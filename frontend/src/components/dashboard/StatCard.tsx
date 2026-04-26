import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({ title, value, subtitle, icon: Icon, tone = 'blue' }: { title: string; value: string | number; subtitle?: string; icon: LucideIcon; tone?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-amber-50 text-amber-700',
    purple: 'bg-indigo-50 text-indigo-700'
  };
  return (
    <div className="gov-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        <div className={cn('rounded-2xl p-3', tones[tone])}><Icon className="h-5 w-5" /></div>
      </div>
    </div>
  );
}
