export function HealthProgressRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;
  return (
    <div className="relative h-24 w-24">
      <svg className="h-24 w-24 -rotate-90">
        <circle cx="48" cy="48" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle cx="48" cy="48" r={radius} stroke="#14539a" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-900">{score.toFixed(0)}</div>
    </div>
  );
}
