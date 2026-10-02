import { useEffect, useState } from 'react';
import { api } from '../api.js';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [period, setPeriod] = useState('month');
  const [rows, setRows] = useState([]);
  useEffect(() => { api.get(`/leaderboard?period=${period}`).then(setRows); }, [period]);
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🦸 Community Hero Spotlight</h1>
          <p className="text-sm text-slate-600">Top contributors by verified reports (resolved or community-corroborated).</p>
        </div>
        <select className="input w-auto" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="month">This month</option><option value="year">This year</option><option value="all">All time</option>
        </select>
      </div>
      {rows.length === 0 && <p className="text-slate-500">No heroes yet for this period — be the first!</p>}
      {rows.map((r, i) => (
        <div key={r.id} className="card flex items-center gap-4">
          <div className="w-10 text-center text-2xl">{MEDAL[i] || `#${i + 1}`}</div>
          <div className="flex-1">
            <div className="font-semibold">{r.name}</div>
            <div className="flex flex-wrap gap-1 text-xs">{r.badges?.map((b) => <span key={b} className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">🏅 {b}</span>)}</div>
          </div>
          <div className="text-right text-sm"><b>{r.verified}</b> verified<div className="text-xs text-slate-500">▲ {r.upvotes} · trust {r.trustScore}</div></div>
        </div>
      ))}
    </div>
  );
}
