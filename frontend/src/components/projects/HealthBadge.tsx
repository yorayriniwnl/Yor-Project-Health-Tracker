import { cn } from '@/lib/utils';

export function HealthBadge({ status, score }: { status: string; score?: number }) {
  const classes: Record<string, string> = {
    HEALTHY: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    WATCHLIST: 'bg-amber-50 text-amber-700 ring-amber-200',
    CRITICAL: 'bg-red-50 text-red-700 ring-red-200'
  };
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1', classes[status] || classes.WATCHLIST)}>{status}{score !== undefined ? ` ${Number(score).toFixed(0)}` : ''}</span>;
}
