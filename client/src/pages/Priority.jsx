import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import IssueCard from '../components/IssueCard.jsx';
import { useRealtime } from '../useRealtime.js';

export default function Priority() {
  const [issues, setIssues] = useState([]);
  const load = useCallback(() => api.get('/issues/priority').then(setIssues), []);
  useEffect(() => { load(); }, [load]);
  useRealtime(load);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">🔥 Priority Tab</h1>
        <p className="text-sm text-slate-600">Unresolved issues ranked by severity, community momentum, corroborating reports and how long they have been pending.</p>
      </div>
      <div className="grid gap-3">{issues.map((i, k) => <IssueCard key={i._id} issue={i} rank={k + 1} />)}</div>
    </div>
  );
}
