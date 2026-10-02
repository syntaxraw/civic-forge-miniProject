const styles = { Raised: 'bg-red-100 text-red-700', 'In Progress': 'bg-amber-100 text-amber-700', Completed: 'bg-green-100 text-green-700' };
export default function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}

export function StatusTracker({ status }) {
  const steps = ['Raised', 'In Progress', 'Completed'];
  const idx = steps.indexOf(status);
  return (
    <div className="flex items-center">
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 items-center last:flex-none">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= idx ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</div>
          <span className={`ml-2 text-xs ${i <= idx ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>{s}</span>
          {i < 2 && <div className={`mx-2 h-0.5 flex-1 ${i < idx ? 'bg-brand-600' : 'bg-slate-200'}`} />}
        </div>
      ))}
    </div>
  );
}
