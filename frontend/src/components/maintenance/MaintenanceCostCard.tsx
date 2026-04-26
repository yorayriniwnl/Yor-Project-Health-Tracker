import { formatCurrency } from '@/lib/utils';

type Props = { projectName: string; expected: number; actual: number; annual: number; budget: number; vendor?: string; riskLevel?: string };

export function MaintenanceCostCard({ projectName, expected, actual, annual, budget, vendor, riskLevel = 'LOW' }: Props) {
  const percentage = budget > 0 ? (annual / budget) * 100 : 0;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4"><div><h3 className="font-bold text-slate-900">{projectName}</h3><p className="text-sm text-slate-500">{vendor ?? 'Vendor not assigned'}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{riskLevel}</span></div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">Expected</dt><dd className="font-semibold">{formatCurrency(expected)}</dd></div><div><dt className="text-slate-500">Actual</dt><dd className="font-semibold">{formatCurrency(actual)}</dd></div><div><dt className="text-slate-500">Annual</dt><dd className="font-semibold">{formatCurrency(annual)}</dd></div><div><dt className="text-slate-500">Cost %</dt><dd className="font-semibold">{percentage.toFixed(2)}%</dd></div></dl>
    </section>
  );
}
