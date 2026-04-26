export function Toast({ message, tone = 'success' }: { message: string; tone?: 'success' | 'error' }) {
  return <div className={`fixed bottom-4 right-4 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${tone === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>{message}</div>;
}
