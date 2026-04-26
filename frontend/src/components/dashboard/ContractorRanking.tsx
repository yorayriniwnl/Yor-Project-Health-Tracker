import { Star } from 'lucide-react';
import { percent } from '@/lib/utils';

export function ContractorRanking({ data }: { data?: any[] }) {
  const rows = data?.length ? data : [
    { contractorName: 'RiverSpan Projects Pvt. Ltd.', successRate: 90, totalProjectsDelivered: 72, qualityRating: 4.5 },
    { contractorName: 'BuildWell Infrastructure Ltd.', successRate: 84.44, totalProjectsDelivered: 38, qualityRating: 4.2 },
    { contractorName: 'MetroWorks Consortium', successRate: 57.14, totalProjectsDelivered: 8, qualityRating: 3.1 }
  ];
  return (
    <div className="gov-card p-5">
      <h3 className="font-bold text-slate-900">Contractor performance ranking</h3>
      <p className="mb-4 text-sm text-slate-500">Ranked by success rate and quality rating.</p>
      <div className="space-y-3">
        {rows.map((c, index) => (
          <div key={c.contractorName} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
            <div>
              <p className="font-semibold text-slate-900">#{index + 1} {c.contractorName}</p>
              <p className="text-xs text-slate-500">Delivered {c.totalProjectsDelivered} projects</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-emerald-700">{percent(c.successRate)}</p>
              <p className="inline-flex items-center gap-1 text-xs text-slate-500"><Star className="h-3 w-3" /> {c.qualityRating}/5</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
