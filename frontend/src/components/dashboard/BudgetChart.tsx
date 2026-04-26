'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const fallback = [
  { projectName: 'Hospital Upgrade', allocated: 500000000, spent: 280000000 },
  { projectName: 'Highway Package', allocated: 850000000, spent: 820000000 },
  { projectName: 'Water Supply', allocated: 650000000, spent: 430000000 }
];

export function BudgetChart({ data }: { data?: { projectName: string; allocated: number; spent: number }[] }) {
  const rows = (data?.length ? data : fallback).slice(0, 8);
  return (
    <div className="gov-card p-5">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900">Budget allocated vs spent</h3>
        <p className="text-sm text-slate-500">Top projects by budget utilization.</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="projectName" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
            <YAxis tickFormatter={(v) => `${Number(v) / 10000000}Cr`} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Bar dataKey="allocated" name="Allocated" fill="#14539a" radius={[6, 6, 0, 0]} />
            <Bar dataKey="spent" name="Spent" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
