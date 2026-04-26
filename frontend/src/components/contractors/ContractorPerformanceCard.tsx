import type { Contractor } from '@/types/contractor';
import { percent } from '@/lib/utils';

export function ContractorPerformanceCard({ contractor }: { contractor: Contractor }) {
  return (
    <div className="gov-card p-5">
      <h3 className="font-bold text-slate-900">{contractor.contractorName}</h3>
      <p className="text-sm text-slate-500">{contractor.companyName}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Success rate</p><p className="text-xl font-bold text-emerald-700">{percent(contractor.successRate)}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Delivered</p><p className="text-xl font-bold text-slate-900">{contractor.totalProjectsDelivered}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">On-time</p><p className="text-xl font-bold text-slate-900">{contractor.completedOnTime}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Quality</p><p className="text-xl font-bold text-slate-900">{contractor.qualityRating}/5</p></div>
      </div>
    </div>
  );
}
