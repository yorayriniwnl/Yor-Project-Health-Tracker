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
    <main className="grid min-h-screen bg-black lg:grid-cols-2">
      <section className="yor-login-rail hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3"><div className="yor-login-mark rounded-none p-3"><Landmark className="h-7 w-7" /></div><div><p className="yor-login-kicker text-sm uppercase tracking-[0.24em]">YOR // field access</p><h1 className="text-2xl font-bold text-white">Project Health Tracker</h1></div></div>
        <div><h2 className="yor-login-copy max-w-xl text-4xl font-bold leading-tight">Track public-sector budget, timelines, contractors, brokers, maintenance, and project health in one secure control center.</h2><p className="yor-login-muted mt-6 max-w-lg">Designed for government administrators, auditors, project managers, contractors, and public transparency users.</p></div>
        <p className="yor-login-muted text-sm">Demo login: admin@govtrack.local / Admin@1234</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="yor-login-form w-full max-w-md rounded-none p-8">
          <div className="mb-8 text-center"><p className="yor-login-kicker font-mono text-xs uppercase tracking-[0.24em]">AUTH // 01</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Sign in</h2><p className="mt-2 text-sm text-slate-500">Use your official government account.</p></div>
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
