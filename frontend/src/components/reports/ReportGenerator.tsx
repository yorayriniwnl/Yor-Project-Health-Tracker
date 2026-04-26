'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { api } from '@/lib/api';

const reportTypes = [
  ['project-health', 'Project Health Report'],
  ['healthy-projects', 'Healthy Projects Report'],
  ['critical-projects', 'Critical Projects Report'],
  ['delayed-projects', 'Delayed Projects Report'],
  ['over-budget-projects', 'Budget Overrun Report'],
  ['contractor-performance', 'Contractor Performance Report'],
  ['broker-risk', 'Broker Risk Report'],
  ['maintenance-heavy-projects', 'Maintenance Cost Report'],
  ['department-performance', 'Department Performance Report'],
  ['completed-projects', 'Completed Projects Report'],
  ['budget-utilization', 'Budget Utilization Report'],
  ['public-transparency', 'Public Transparency Report']
];

export function ReportGenerator() {
  const [type, setType] = useState('project-health');
  const [format, setFormat] = useState('csv');
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setError(null);
    try {
      const response = await api.get(`/reports/export?type=${type}&format=${format}`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `government-project-health-${type}.${format === 'xlsx' ? 'xlsx' : format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || 'Unable to generate report');
    }
  }

  return (
    <div className="gov-card p-5">
      <h3 className="text-lg font-bold text-slate-900">Generate report</h3>
      <p className="mb-4 text-sm text-slate-500">Export filtered project information to CSV, Excel, or PDF.</p>
      {error ? <div className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Report type</span><select value={type} onChange={(e) => setType(e.target.value)} className="gov-input">{reportTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Format</span><select value={format} onChange={(e) => setFormat(e.target.value)} className="gov-input"><option value="csv">CSV</option><option value="xlsx">Excel</option><option value="pdf">PDF</option></select></label>
        <div className="flex items-end"><button onClick={download} className="gov-button w-full"><Download className="mr-2 h-4 w-4" /> Download</button></div>
      </div>
    </div>
  );
}
