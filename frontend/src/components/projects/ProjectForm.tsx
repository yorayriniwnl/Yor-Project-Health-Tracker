'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { projectFormSchema, type ProjectFormValues } from '@/lib/validations';
import type { Department } from '@/types/project';
import type { Contractor } from '@/types/contractor';
import type { Broker } from '@/types/broker';

export function ProjectForm({ initialValues }: { initialValues?: Partial<ProjectFormValues> & { id?: string } }) {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      status: 'PLANNED',
      budgetReleased: 0,
      budgetSpent: 0,
      progressPercentage: 0,
      overrunApproved: false,
      expectedMaintenanceCost: 0,
      actualMaintenanceCost: 0,
      annualMaintenanceCost: 0,
      ...initialValues
    }
  });

  useEffect(() => {
    Promise.all([
      api.get('/departments?limit=100'),
      api.get('/contractors?limit=100'),
      api.get('/brokers?limit=100')
    ]).then(([d, c, b]) => {
      setDepartments(d.data.items || []);
      setContractors(c.data.items || []);
      setBrokers(b.data.items || []);
    }).catch(() => undefined);
  }, []);

  const onSubmit = async (values: ProjectFormValues) => {
    setError(null);
    try {
      const payload = { ...values, contractorId: values.contractorId || null, brokerId: values.brokerId || null };
      if (initialValues?.id) await api.put(`/projects/${initialValues.id}`, payload);
      else await api.post('/projects', payload);
      router.push('/projects');
    } catch (e: any) {
      setError(e.message || 'Unable to save project.');
    }
  };

  const field = (name: keyof ProjectFormValues, label: string, type = 'text') => (
    <label className="space-y-1 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <input type={type} {...register(name as any)} className="gov-input" />
      {errors[name] ? <span className="text-xs text-red-600">{String(errors[name]?.message)}</span> : null}
    </label>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <div className="gov-card p-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Project overview</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {field('projectName', 'Project name')}
          <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Department</span><select {...register('departmentId')} className="gov-input"><option value="">Select department</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
          {field('ministry', 'Ministry')}
          {field('location', 'Location')}
          {field('projectType', 'Project type')}
          <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Status</span><select {...register('status')} className="gov-input"><option value="PLANNED">Planned</option><option value="IN_PROGRESS">In progress</option><option value="DELAYED">Delayed</option><option value="COMPLETED">Completed</option><option value="SUSPENDED">Suspended</option><option value="CANCELLED">Cancelled</option></select></label>
          <label className="space-y-1 text-sm md:col-span-2"><span className="font-semibold text-slate-700">Description</span><textarea {...register('description')} className="gov-input min-h-24" /></label>
        </div>
      </div>

      <div className="gov-card p-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Budget and timeline</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {field('budgetAllocated', 'Budget allocated', 'number')}
          {field('budgetReleased', 'Budget released', 'number')}
          {field('budgetSpent', 'Budget spent', 'number')}
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" {...register('overrunApproved')} /><span className="font-semibold text-slate-700">Overrun approved</span></label>
          {field('startDate', 'Start date', 'date')}
          {field('expectedCompletionDate', 'Expected completion date', 'date')}
          {field('expectedDurationDays', 'Expected duration days', 'number')}
          {field('progressPercentage', 'Progress percentage', 'number')}
        </div>
      </div>

      <div className="gov-card p-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Contractor, broker, and maintenance</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Contractor</span><select {...register('contractorId')} className="gov-input"><option value="">Select contractor</option>{contractors.map((c) => <option key={c.id} value={c.id}>{c.contractorName}</option>)}</select></label>
          <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Broker / consultant</span><select {...register('brokerId')} className="gov-input"><option value="">No broker</option>{brokers.map((b) => <option key={b.id} value={b.id}>{b.brokerName}</option>)}</select></label>
          {field('expectedMaintenanceCost', 'Expected maintenance cost', 'number')}
          {field('actualMaintenanceCost', 'Actual maintenance cost', 'number')}
          {field('annualMaintenanceCost', 'Annual maintenance cost', 'number')}
          <label className="space-y-1 text-sm md:col-span-2"><span className="font-semibold text-slate-700">Risk notes</span><textarea {...register('riskNotes')} className="gov-input min-h-24" /></label>
        </div>
      </div>
      <div className="flex justify-end gap-3"><button type="button" onClick={() => router.back()} className="gov-button-secondary">Cancel</button><button disabled={isSubmitting} className="gov-button">{initialValues?.id ? 'Update project' : 'Create project'}</button></div>
    </form>
  );
}
