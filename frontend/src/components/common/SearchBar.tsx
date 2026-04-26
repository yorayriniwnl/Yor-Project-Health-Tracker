import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2">
      <Search className="h-4 w-4 text-slate-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border-0 bg-transparent text-sm outline-none" />
    </div>
  );
}
