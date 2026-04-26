'use client';

import Link from 'next/link';
import type { Project } from '@/types/project';
import { formatCurrency, formatDate, percent } from '@/lib/utils';
import { HealthBadge } from './HealthBadge';
import { StatusBadge } from './StatusBadge';

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="gov-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Project ID</th>
              <th className="px-4 py-3">Project name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Contractor</th>
              <th className="px-4 py-3">Budget allocated</th>
              <th className="px-4 py-3">Budget spent</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">{project.projectCode}</td>
                <td className="px-4 py-3 font-semibold text-gov-blue"><Link href={`/projects/${project.id}`}>{project.projectName}</Link></td>
                <td className="px-4 py-3 text-slate-600">{project.department?.name || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{project.location}</td>
                <td className="px-4 py-3 text-slate-600">{project.contractor?.contractorName || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{formatCurrency(project.budgetAllocated)}</td>
                <td className="px-4 py-3 text-slate-700">{formatCurrency(project.budgetSpent)}</td>
                <td className="px-4 py-3"><div className="h-2 w-24 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-gov-blue" style={{ width: `${project.progressPercentage}%` }} /></div><span className="text-xs text-slate-500">{percent(project.progressPercentage)}</span></td>
                <td className="px-4 py-3 text-slate-600">{formatDate(project.expectedCompletionDate)}</td>
                <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                <td className="px-4 py-3"><HealthBadge status={project.healthStatus} score={project.healthScore} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
