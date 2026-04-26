import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    COMPLETED: 'bg-blue-50 text-blue-700 ring-blue-200',
    DELAYED: 'bg-red-50 text-red-700 ring-red-200',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    PLANNED: 'bg-slate-50 text-slate-700 ring-slate-200',
    SUSPENDED: 'bg-amber-50 text-amber-700 ring-amber-200',
    CANCELLED: 'bg-zinc-100 text-zinc-700 ring-zinc-200'
  };
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1', classes[status] || classes.PLANNED)}>{status.replaceAll('_', ' ')}</span>;
}
