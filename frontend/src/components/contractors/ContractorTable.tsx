import type { Contractor } from '@/types/contractor';
import { percent } from '@/lib/utils';

export function ContractorTable({ contractors }: { contractors: Contractor[] }) {
  return (
    <div className="gov-card overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr><th className="px-4 py-3">Contractor</th><th className="px-4 py-3">Registration</th><th className="px-4 py-3">Experience</th><th className="px-4 py-3">Delivered</th><th className="px-4 py-3">On time</th><th className="px-4 py-3">Within budget</th><th className="px-4 py-3">Success</th><th className="px-4 py-3">Quality</th><th className="px-4 py-3">Risk</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {contractors.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3"><p className="font-semibold text-slate-900">{c.contractorName}</p><p className="text-xs text-slate-500">{c.companyName}</p></td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.registrationNumber}</td>
              <td className="px-4 py-3">{c.yearsExperience} years</td>
              <td className="px-4 py-3">{c.totalProjectsDelivered}/{c.pastProjectsHandled}</td>
              <td className="px-4 py-3">{c.completedOnTime}</td>
              <td className="px-4 py-3">{c.completedWithinBudget}</td>
              <td className="px-4 py-3 font-bold text-emerald-700">{percent(c.successRate)}</td>
              <td className="px-4 py-3">{c.qualityRating}/5</td>
              <td className="px-4 py-3">{c.blacklisted ? <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Blacklisted</span> : <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">Clear</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
