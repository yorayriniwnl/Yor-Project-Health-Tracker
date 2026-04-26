import { StatusBadge } from './StatusBadge';

export function HealthScoreBadge({ score, status }: { score: number; status: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">{Math.round(score)}/100</span>
      <StatusBadge value={status} />
    </div>
  );
}
