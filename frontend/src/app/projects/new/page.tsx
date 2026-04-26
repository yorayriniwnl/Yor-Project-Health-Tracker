import { AppShell } from '@/components/layout/AppShell';
import { ProjectForm } from '@/components/projects/ProjectForm';

export default function NewProjectPage() {
  return (
    <AppShell>
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Create project</h1><p className="text-sm text-slate-500">Capture budget, timeline, contractor, broker, maintenance, and risk information.</p></div>
      <ProjectForm />
    </AppShell>
  );
}
