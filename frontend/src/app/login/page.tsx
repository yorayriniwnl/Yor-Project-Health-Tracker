'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark } from 'lucide-react';
import { dashboardPathForRole, login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@govtrack.local');
  const [password, setPassword] = useState('Admin@1234');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(dashboardPathForRole(user.role));
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="hidden bg-gov-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Landmark className="h-7 w-7" /></div><div><p className="text-sm uppercase tracking-wide text-blue-100">Government</p><h1 className="text-2xl font-bold">Project Health Tracker</h1></div></div>
        <div><h2 className="max-w-xl text-4xl font-bold leading-tight">Track public-sector budget, timelines, contractors, brokers, maintenance, and project health in one secure control center.</h2><p className="mt-6 max-w-lg text-blue-100">Designed for government administrators, auditors, project managers, contractors, and public transparency users.</p></div>
        <p className="text-sm text-blue-100">Demo login: admin@govtrack.local / Admin@1234</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
          <div className="mb-8 text-center"><h2 className="text-2xl font-bold text-slate-900">Sign in</h2><p className="mt-2 text-sm text-slate-500">Use your official government account.</p></div>
          {error ? <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
          <label className="mb-4 block space-y-1 text-sm"><span className="font-semibold text-slate-700">Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} className="gov-input" type="email" /></label>
          <label className="mb-2 block space-y-1 text-sm"><span className="font-semibold text-slate-700">Password</span><input value={password} onChange={(e) => setPassword(e.target.value)} className="gov-input" type="password" /></label>
          <a href="#" className="text-sm font-semibold text-gov-blue">Forgot password?</a>
          <button disabled={loading} className="gov-button mt-6 w-full">{loading ? 'Signing in...' : 'Login'}</button>
        </form>
      </section>
    </main>
  );
}
