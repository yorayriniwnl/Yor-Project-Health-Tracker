'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProjectTable } from '@/components/projects/ProjectTable';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterPanel } from '@/components/common/FilterPanel';
import { EmptyState } from '@/components/common/EmptyState';
import { fetcher } from '@/lib/api';
import type { Paginated, Project } from '@/types/project';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [status, setStatus] = useState('');
  const query = useMemo(() => new URLSearchParams({ limit: '50', ...(search ? { search } : {}), ...(healthStatus ? { healthStatus } : {}), ...(status ? { status } : {}) }).toString(), [search, healthStatus, status]);
  const { data } = useQuery({ queryKey: ['projects', query], queryFn: () => fetcher<Paginated<Project>>(`/projects?${query}`) });
  const projects = data?.items || [];

  return (
    <AppShell>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><h1 className="text-2xl font-bold text-slate-900">Projects</h1><p className="text-sm text-slate-500">Search, filter, sort, export, and monitor all funded projects.</p></div><Link href="/projects/new" className="gov-button"><Plus className="mr-2 h-4 w-4" /> Add Project</Link></div>
      <FilterPanel>
        <div className="md:col-span-2"><SearchBar value={search} onChange={setSearch} placeholder="Search by project, code, location, or type" /></div>
        <select value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)} className="gov-input"><option value="">All health</option><option value="HEALTHY">Healthy</option><option value="WATCHLIST">Watchlist</option><option value="CRITICAL">Critical</option></select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="gov-input"><option value="">All status</option><option value="PLANNED">Planned</option><option value="IN_PROGRESS">In progress</option><option value="DELAYED">Delayed</option><option value="COMPLETED">Completed</option><option value="SUSPENDED">Suspended</option></select>
      </FilterPanel>
      <div className="mt-4">{projects.length ? <ProjectTable projects={projects} /> : <EmptyState title="No projects found" />}</div>
    </AppShell>
  );
}
