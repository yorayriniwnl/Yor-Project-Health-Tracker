'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { api } from '@/lib/api';
import { projects as sampleProjects } from '@/lib/mockData';
import type { Project } from '@/types/project';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(sampleProjects.find((p) => p.id === params.id) ?? sampleProjects[0]);
  useEffect(() => { api.get(`/projects/${params.id}`).then((res) => setProject(res.data)).catch(() => undefined); }, [params.id]);
  const initialValues = project ? {
    ...project,
    ministry: project.ministry ?? undefined,
    description: project.description ?? undefined,
    contractorId: project.contractorId ?? undefined,
    brokerId: project.brokerId ?? undefined,
    riskNotes: project.riskNotes ?? undefined
  } : undefined;

  return (
    <AppShell>
      <div className="mb-5"><h1 className="text-2xl font-black text-slate-950">Edit project</h1><p className="text-sm text-slate-500">Update budget spent, progress, timeline, status, contractor, broker, maintenance cost, and notes.</p></div>
      {initialValues ? <ProjectForm initialValues={initialValues} /> : null}
    </AppShell>
  );
}
