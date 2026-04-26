'use client';

export function BrokerForm() {
  return (
    <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:grid-cols-2">
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Broker / consultant name</span><input className="gov-input" /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Organization</span><input className="gov-input" /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Role</span><input className="gov-input" placeholder="Procurement consultant" /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Fee amount</span><input className="gov-input" type="number" min="0" /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Compliance status</span><select className="gov-input"><option>VERIFIED</option><option>PENDING</option><option>UNDER_REVIEW</option><option>NON_COMPLIANT</option></select></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Risk level</span><select className="gov-input"><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select></label>
      <label className="space-y-1 text-sm md:col-span-2"><span className="font-semibold text-slate-700">Audit remarks</span><textarea className="gov-input min-h-24" /></label>
      <div className="md:col-span-2"><button className="gov-button" type="button">Save broker</button></div>
    </form>
  );
}
