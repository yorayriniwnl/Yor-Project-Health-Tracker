import type { Broker } from '@/types/broker';
import { formatCurrency } from '@/lib/utils';

export function BrokerTable({ brokers }: { brokers: Broker[] }) {
  return (
    <div className="gov-card overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr><th className="px-4 py-3">Broker / Consultant</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Commission</th><th className="px-4 py-3">Compliance</th><th className="px-4 py-3">COI</th><th className="px-4 py-3">Risk</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {brokers.map((b) => (
            <tr key={b.id}>
              <td className="px-4 py-3"><p className="font-semibold text-slate-900">{b.brokerName}</p><p className="text-xs text-slate-500">{b.organization}</p></td>
              <td className="px-4 py-3">{b.role}</td>
              <td className="px-4 py-3">{formatCurrency(b.feeAmount)}</td>
              <td className="px-4 py-3">{b.commissionPercentage}%</td>
              <td className="px-4 py-3">{b.complianceStatus.replaceAll('_', ' ')}</td>
              <td className="px-4 py-3">{b.conflictOfInterest ? 'Declared' : 'No'}</td>
              <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{b.riskLevel}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
