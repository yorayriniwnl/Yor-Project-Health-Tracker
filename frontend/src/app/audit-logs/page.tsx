'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { fetcher } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AuditLogsPage() {
  const { data } = useQuery({ queryKey: ['audit-logs'], queryFn: () => fetcher<any>('/audit-logs?limit=100') });
  const logs = data?.items || [];
  return (
    <AppShell>
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Audit logs</h1><p className="text-sm text-slate-500">Trace sensitive changes including budget, status, contractor, broker, and health recalculations.</p></div>
      <div className="gov-card overflow-hidden"><table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Timestamp</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th><th className="px-4 py-3">IP</th></tr></thead><tbody className="divide-y divide-slate-100 bg-white">{logs.map((log: any) => <tr key={log.id}><td className="px-4 py-3">{formatDate(log.createdAt)}</td><td className="px-4 py-3">{log.user?.fullName || 'System'}</td><td className="px-4 py-3 font-semibold">{log.action}</td><td className="px-4 py-3">{log.entityType} / {log.entityId}</td><td className="px-4 py-3">{log.ipAddress || '-'}</td></tr>)}</tbody></table></div>
    </AppShell>
  );
}
