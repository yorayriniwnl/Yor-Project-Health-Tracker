'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { BrokerTable } from '@/components/brokers/BrokerTable';
import { BrokerRiskCard } from '@/components/brokers/BrokerRiskCard';
import { SearchBar } from '@/components/common/SearchBar';
import { fetcher } from '@/lib/api';
import type { Broker } from '@/types/broker';

export default function BrokersPage() {
  const [q, setQ] = useState('');
  const { data } = useQuery({ queryKey: ['brokers', q], queryFn: () => fetcher<{ items: Broker[] }>(`/brokers?limit=100&q=${encodeURIComponent(q)}`) });
  const brokers = data?.items || [];
  return (
    <AppShell>
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Broker / consultant management</h1><p className="text-sm text-slate-500">Track fee, commission, compliance, conflict of interest, linked projects, and risk level.</p></div>
      <div className="mb-4"><SearchBar value={q} onChange={setQ} placeholder="Search brokers and consultants" /></div>
      <div className="mb-6 grid gap-4 lg:grid-cols-3">{brokers.slice(0, 3).map((b) => <BrokerRiskCard key={b.id} broker={b} />)}</div>
      <BrokerTable brokers={brokers} />
    </AppShell>
  );
}
