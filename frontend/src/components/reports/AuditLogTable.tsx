type AuditLog = { actor: string; action: string; entity: string; oldValue?: string; newValue?: string; ipAddress?: string; createdAt: string };

export function AuditLogTable({ logs = [] }: { logs?: AuditLog[] }) {
  const rows = logs.length ? logs : [
    { actor: 'Super Admin', action: 'Created project', entity: 'District Hospital Upgrade', oldValue: '-', newValue: 'Project created', ipAddress: '10.0.0.5', createdAt: '2026-04-25 09:30' },
    { actor: 'Auditor', action: 'Flagged broker risk', entity: 'North River Bridge Repair', oldValue: 'MEDIUM', newValue: 'HIGH', ipAddress: '10.0.0.9', createdAt: '2026-04-25 10:15' }
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th><th className="px-4 py-3">Old value</th><th className="px-4 py-3">New value</th><th className="px-4 py-3">IP address</th><th className="px-4 py-3">Time</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={`${row.entity}-${row.createdAt}`}><td className="px-4 py-3">{row.actor}</td><td className="px-4 py-3">{row.action}</td><td className="px-4 py-3">{row.entity}</td><td className="px-4 py-3">{row.oldValue}</td><td className="px-4 py-3">{row.newValue}</td><td className="px-4 py-3">{row.ipAddress}</td><td className="px-4 py-3">{row.createdAt}</td></tr>)}</tbody></table>
    </div>
  );
}
