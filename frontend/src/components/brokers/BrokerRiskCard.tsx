import type { Broker } from '@/types/broker';

export function BrokerRiskCard({ broker }: { broker: Broker }) {
  const high = broker.riskLevel === 'HIGH' || broker.riskLevel === 'CRITICAL' || broker.conflictOfInterest || broker.complianceStatus !== 'VERIFIED';
  return (
    <div className="gov-card p-5">
      <h3 className="font-bold text-slate-900">{broker.brokerName}</h3>
      <p className="text-sm text-slate-500">{broker.role}</p>
      <div className={`mt-4 rounded-xl p-4 text-sm ${high ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
        Risk level: <strong>{broker.riskLevel}</strong>. Compliance: <strong>{broker.complianceStatus}</strong>. Conflict of interest: <strong>{broker.conflictOfInterest ? 'Yes' : 'No'}</strong>.
      </div>
    </div>
  );
}
