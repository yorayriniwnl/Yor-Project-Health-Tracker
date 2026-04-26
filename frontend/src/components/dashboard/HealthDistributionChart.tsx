'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const fallback = [
  { healthStatus: 'HEALTHY', count: 12 },
  { healthStatus: 'WATCHLIST', count: 5 },
  { healthStatus: 'CRITICAL', count: 3 }
];
const colors: Record<string, string> = { HEALTHY: '#059669', WATCHLIST: '#f59e0b', CRITICAL: '#dc2626' };

export function HealthDistributionChart({ data }: { data?: { healthStatus: string; count: number }[] }) {
  const rows = data?.length ? data : fallback;
  return (
    <div className="gov-card p-5">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900">Project health distribution</h3>
        <p className="text-sm text-slate-500">Healthy, watchlist, and critical portfolio split.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={rows} dataKey="count" nameKey="healthStatus" innerRadius={60} outerRadius={95} paddingAngle={3}>
              {rows.map((entry) => <Cell key={entry.healthStatus} fill={colors[entry.healthStatus] || '#64748b'} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {rows.map((row) => <div key={row.healthStatus} className="rounded-xl bg-slate-50 p-2"><span className="font-semibold">{row.healthStatus}</span><br />{row.count} projects</div>)}
      </div>
    </div>
  );
}
