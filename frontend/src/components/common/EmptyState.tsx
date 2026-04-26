import { Inbox } from 'lucide-react';

export function EmptyState({ title = 'No records found', description = 'Try changing the filters or add a new record.' }: { title?: string; description?: string }) {
  return (
    <div className="gov-card flex flex-col items-center justify-center p-10 text-center">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-500"><Inbox className="h-8 w-8" /></div>
      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
