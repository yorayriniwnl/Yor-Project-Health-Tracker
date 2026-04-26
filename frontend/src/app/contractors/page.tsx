'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { ContractorTable } from '@/components/contractors/ContractorTable';
import { ContractorPerformanceCard } from '@/components/contractors/ContractorPerformanceCard';
import { SearchBar } from '@/components/common/SearchBar';
import { fetcher } from '@/lib/api';
import type { Contractor } from '@/types/contractor';

export default function ContractorsPage() {
  const [q, setQ] = useState('');
  const { data } = useQuery({ queryKey: ['contractors', q], queryFn: () => fetcher<{ items: Contractor[] }>(`/contractors?limit=100&q=${encodeURIComponent(q)}`) });
  const contractors = data?.items || [];
  return (
    <AppShell>
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Contractor management</h1><p className="text-sm text-slate-500">Track past experience, delivered projects, on-time record, quality, disputes, and blacklist status.</p></div>
      <div className="mb-4"><SearchBar value={q} onChange={setQ} placeholder="Search contractors" /></div>
      <div className="mb-6 grid gap-4 lg:grid-cols-3">{contractors.slice(0, 3).map((c) => <ContractorPerformanceCard key={c.id} contractor={c} />)}</div>
      <ContractorTable contractors={contractors} />
    </AppShell>
  );
}
