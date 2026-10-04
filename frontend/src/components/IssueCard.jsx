import { Link } from 'react-router-dom';
import { useState } from 'react';
import StatusBadge from './StatusBadge.jsx';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

const ICON = { roads: '🛣️', water: '💧', electricity: '⚡', waste: '🗑️', sanitation: '🚰', safety: '🚨', other: '📌' };

export default function IssueCard({ issue, rank }) {
  const { user } = useAuth();
  const [up, setUp] = useState({ count: issue.upvoteCount, has: issue.hasUpvoted });

  const toggle = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to upvote');
    const r = await api.post(`/issues/${issue._id}/upvote`);
    setUp({ count: r.upvoteCount, has: r.hasUpvoted });
  };

  return (
    <Link to={`/issues/${issue._id}`} className="card flex gap-4 transition hover:shadow-md">
      {rank && <div className="text-2xl font-bold text-slate-300">#{rank}</div>}
      {issue.photos?.[0] ? (
        <img src={issue.photos[0]} alt="" className="h-24 w-24 flex-none rounded-lg object-cover" />
      ) : (
        <div className="flex h-24 w-24 flex-none items-center justify-center rounded-lg bg-slate-100 text-3xl">{ICON[issue.category]}</div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={issue.status} />
          <span className="text-xs uppercase tracking-wide text-slate-400">{issue.category}</span>
          {issue.mergedCount > 0 && <span className="rounded bg-blue-50 px-1.5 text-xs text-blue-600">🔗 {issue.mergedCount} merged</span>}
          <span className="ml-auto text-xs text-slate-400" title="Priority score">⚑ {issue.priorityScore}</span>
        </div>
        <h3 className="mt-1 truncate font-semibold">{issue.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{issue.description}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          <button onClick={toggle} className={`rounded-full border px-3 py-1 font-medium ${up.has ? 'border-brand-500 bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>
            ▲ {up.count} {up.has ? 'Corroborated' : 'Me too'}
          </button>
          <span>by {issue.reporter?.name || 'resident'}</span>
          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
