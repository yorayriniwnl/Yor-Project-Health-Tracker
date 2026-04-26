'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Landmark, Search } from 'lucide-react';
import { fetcher } from '@/lib/api';
import { formatCurrency, formatDate, percent } from '@/lib/utils';

export default function PublicPortalPage() {
  const [q, setQ] = useState('');
  const { data } = useQuery({ queryKey: ['public-projects', q], queryFn: () => fetcher<any>(`/public/projects?limit=100&search=${encodeURIComponent(q)}`) });
  const projects = data?.items || [];
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5"><div className="flex items-center gap-3"><div className="rounded-2xl bg-gov-blue p-3 text-white"><Landmark className="h-6 w-6" /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-gov-blue">Public transparency portal</p><h1 className="text-xl font-bold text-slate-900">Government Project Health Tracker</h1></div></div><Link href="/login" className="gov-button-secondary">Official login</Link></div></header>
      <section className="mx-auto max-w-7xl px-4 py-8"><div className="mb-6"><h2 className="text-2xl font-bold text-slate-900">Public project summary</h2><p className="text-sm text-slate-500">Broker commissions, internal audit notes, risk investigation notes, and sensitive disputes are hidden.</p></div><div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2"><Search className="h-4 w-4 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search public projects" className="w-full border-0 bg-transparent text-sm outline-none" /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((p: any) => <article key={p.id} className="gov-card p-5"><div className="flex justify-between gap-3"><div><p className="font-mono text-xs text-slate-500">{p.projectCode}</p><h3 className="font-bold text-slate-900">{p.projectName}</h3><p className="text-sm text-slate-500">{p.department?.name} - {p.location}</p></div><span className="h-fit rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{p.healthStatus}</span></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Budget</p><p className="font-bold">{formatCurrency(p.budgetAllocated)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Progress</p><p className="font-bold">{percent(p.progressPercentage)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Status</p><p className="font-bold">{p.status.replaceAll('_', ' ')}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Expected</p><p className="font-bold">{formatDate(p.expectedCompletionDate)}</p></div></div></article>)}</div></section>
    </main>
  );
}
