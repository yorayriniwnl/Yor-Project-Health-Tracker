import { cn, humanizeEnum } from '@/lib/utils';

const statusClasses: Record<string, string> = {
  HEALTHY: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  WATCHLIST: 'bg-amber-50 text-amber-700 ring-amber-200',
  CRITICAL: 'bg-red-50 text-red-700 ring-red-200',
  COMPLETED: 'bg-blue-50 text-blue-700 ring-blue-200',
  DELAYED: 'bg-red-50 text-red-700 ring-red-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  PLANNED: 'bg-slate-50 text-slate-700 ring-slate-200',
  LOW: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  MEDIUM: 'bg-amber-50 text-amber-700 ring-amber-200',
  HIGH: 'bg-red-50 text-red-700 ring-red-200'
};

export function StatusBadge({ value }: { value: string }) {
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1', statusClasses[value] ?? 'bg-slate-50 text-slate-700 ring-slate-200')}>{humanizeEnum(value)}</span>;
}
