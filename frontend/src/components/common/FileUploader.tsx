'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { api } from '@/lib/api';

export function FileUploader({ projectId, onUploaded }: { projectId: string; onUploaded?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  async function upload() {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    form.append('documentName', file.name);
    await api.post(`/projects/${projectId}/documents`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setStatus('Uploaded successfully');
    setFile(null);
    onUploaded?.();
  }
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-4">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
      <button type="button" onClick={upload} disabled={!file} className="gov-button mt-3"><Upload className="mr-2 h-4 w-4" /> Upload document</button>
      {status ? <p className="mt-2 text-sm text-emerald-700">{status}</p> : null}
    </div>
  );
}
