'use client';

export function ContractorForm() {
  return (
    <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:grid-cols-2">
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Contractor name</span><input className="gov-input" placeholder="BuildWell Infrastructure Ltd." /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Registration number</span><input className="gov-input" placeholder="BW-IND-2009" /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Years experience</span><input className="gov-input" type="number" min="0" /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Past projects handled</span><input className="gov-input" type="number" min="0" /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Total projects delivered</span><input className="gov-input" type="number" min="0" /></label>
      <label className="space-y-1 text-sm"><span className="font-semibold text-slate-700">Quality rating</span><input className="gov-input" type="number" min="0" max="5" step="0.1" /></label>
      <label className="space-y-1 text-sm md:col-span-2"><span className="font-semibold text-slate-700">Dispute history</span><textarea className="gov-input min-h-24" /></label>
      <div className="md:col-span-2"><button className="gov-button" type="button">Save contractor</button></div>
    </form>
  );
}
