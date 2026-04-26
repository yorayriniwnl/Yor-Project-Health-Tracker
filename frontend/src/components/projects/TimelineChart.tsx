export function TimelineChart({ elapsed, progress }: { elapsed: number; progress: number }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex justify-between text-sm"><span>Time elapsed</span><span>{elapsed}%</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-slate-900" style={{ width: `${Math.min(Math.max(elapsed, 0), 100)}%` }} /></div>
      <div className="mt-4 flex justify-between text-sm"><span>Physical progress</span><span>{progress}%</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-indigo-600" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} /></div>
    </section>
  );
}
