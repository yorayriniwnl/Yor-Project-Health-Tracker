'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { fetcher } from '@/lib/api';
import type { Project } from '@/types/project';
import { formatCurrency, formatDate, percent } from '@/lib/utils';
import { HealthBadge } from '@/components/projects/HealthBadge';
import { StatusBadge } from '@/components/projects/StatusBadge';
import { HealthProgressRing } from '@/components/projects/HealthProgressRing';
import { FileUploader } from '@/components/common/FileUploader';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: project, refetch } = useQuery({ queryKey: ['project', params.id], queryFn: () => fetcher<Project & any>(`/projects/${params.id}`), enabled: Boolean(params.id) });
  if (!project) return <AppShell><div className="gov-card p-6">Loading project...</div></AppShell>;
  return (
    <AppShell>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div><p className="font-mono text-xs text-slate-500">{project.projectCode}</p><h1 className="text-2xl font-bold text-slate-900">{project.projectName}</h1><p className="text-sm text-slate-500">{project.department?.name} - {project.location}</p></div>
        <div className="flex gap-2"><StatusBadge status={project.status} /><HealthBadge status={project.healthStatus} score={project.healthScore} /></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Project overview</h2><p className="text-sm text-slate-600">{project.description || 'No description provided.'}</p><div className="mt-4 grid gap-4 md:grid-cols-3"><Info label="Type" value={project.projectType} /><Info label="Start date" value={formatDate(project.startDate)} /><Info label="Expected completion" value={formatDate(project.expectedCompletionDate)} /></div></section>
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Budget details</h2><div className="grid gap-4 md:grid-cols-4"><Info label="Allocated" value={formatCurrency(project.budgetAllocated)} /><Info label="Released" value={formatCurrency(project.budgetReleased)} /><Info label="Spent" value={formatCurrency(project.budgetSpent)} /><Info label="Remaining" value={formatCurrency(project.budgetRemaining)} /></div></section>
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Contractor profile</h2>{project.contractor ? <div className="grid gap-4 md:grid-cols-4"><Info label="Name" value={project.contractor.contractorName} /><Info label="Experience" value={`${project.contractor.yearsExperience} years`} /><Info label="Delivered" value={project.contractor.totalProjectsDelivered} /><Info label="Success" value={percent(project.contractor.successRate)} /></div> : <p className="text-sm text-slate-500">No contractor linked.</p>}</section>
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Broker / consultant details</h2>{project.broker ? <div className="grid gap-4 md:grid-cols-4"><Info label="Name" value={project.broker.brokerName} /><Info label="Role" value={project.broker.role} /><Info label="Compliance" value={project.broker.complianceStatus} /><Info label="Risk" value={project.broker.riskLevel} /></div> : <p className="text-sm text-slate-500">No broker linked.</p>}</section>
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Milestones</h2><div className="space-y-3">{project.milestones?.map((m: any) => <div key={m.id} className="rounded-xl border border-slate-100 p-3"><div className="flex justify-between"><p className="font-semibold text-slate-900">{m.milestoneName}</p><StatusBadge status={m.status} /></div><p className="text-xs text-slate-500">{formatDate(m.plannedStartDate)} to {formatDate(m.plannedEndDate)} - {percent(m.progressPercentage)}</p></div>)}</div></section>
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Documents</h2><FileUploader projectId={project.id} onUploaded={() => refetch()} /><div className="mt-4 space-y-2">{project.documents?.map((d: any) => <a key={d.id} className="block rounded-xl bg-slate-50 p-3 text-sm font-semibold text-gov-blue" href={d.fileUrl}>{d.documentName}</a>)}</div></section>
        </div>
        <aside className="space-y-6">
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Project health score</h2><div className="flex justify-center"><HealthProgressRing score={project.healthScore} /></div><p className="mt-4 text-center text-sm text-slate-500">{project.healthStatus} - Risk level {project.riskLevel}</p></section>
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Maintenance cost</h2><Info label="Expected" value={formatCurrency(project.expectedMaintenanceCost)} /><Info label="Actual" value={formatCurrency(project.actualMaintenanceCost)} /><Info label="Annual" value={formatCurrency(project.annualMaintenanceCost)} /></section>
          <section className="gov-card p-5"><h2 className="mb-3 text-lg font-bold text-slate-900">Risk and audit notes</h2><p className="text-sm text-slate-600">{project.riskNotes || 'No open risk notes.'}</p></section>
        </aside>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p></div>;
}
