import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, LANGS } from '../api.js';
import { useAuth } from '../auth.jsx';
import StatusBadge, { StatusTracker } from '../components/StatusBadge.jsx';
import MapView from '../components/MapView.jsx';
import { useRealtime } from '../useRealtime.js';

export default function IssueDetail() {
  const { id } = useParams();
  const { user, isStaff } = useAuth();
  const [issue, setIssue] = useState(null);
  const [lang, setLang] = useState('');
  const [note, setNote] = useState('');
  const [handoff, setHandoff] = useState(null);
  const [err, setErr] = useState('');

  const load = useCallback(() => api.get(`/issues/${id}${lang ? `?lang=${lang}` : ''}`).then(setIssue).catch((e) => setErr(e.message)), [id, lang]);
  useEffect(() => { load(); }, [load]);
  useRealtime((m) => m.payload?.id === id && load());

  if (err) return <p className="text-red-600">{err}</p>;
  if (!issue) return <p className="text-slate-500">Loading…</p>;

  const [lng, lat] = issue.location.coordinates;
  const t = issue.translation;
  const upvote = async () => {
    if (!user) return alert('Please login to corroborate');
    await api.post(`/issues/${id}/upvote`);
    load();
  };
  const setStatus = async (status) => { await api.patch(`/issues/${id}/status`, { status, note }); setNote(''); load(); };
  const markSpam = async () => { if (confirm('Mark as spam and hide?')) { await api.post(`/issues/${id}/spam`); load(); } };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="card space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={issue.status} />
            <span className="text-xs uppercase text-slate-400">{issue.category}</span>
            <span className="text-xs text-slate-500">Severity {issue.severity}/5 · Priority ⚑ {issue.priorityScore}</span>
            {issue.hidden && <span className="rounded bg-red-100 px-2 text-xs text-red-700">Hidden (flagged)</span>}
            <select className="input ml-auto w-auto" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="">🌐 Translate…</option>
              {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <h1 className="text-2xl font-bold">{t?.title || issue.title}</h1>
          <p className="whitespace-pre-line text-slate-700">{t?.description || issue.description}</p>
          {lang && lang !== issue.language && !t && <p className="text-xs text-amber-600">Translation unavailable. Check that GEMINI_API_KEY is configured on the server, then try again.</p>}
          {issue.photos?.length > 0 && <div className="flex flex-wrap gap-2">{issue.photos.map((p) => <img key={p} src={p} className="h-40 rounded-lg object-cover" alt="" />)}</div>}
          <div className="flex items-center gap-3">
            <button onClick={upvote} className={`btn ${issue.hasUpvoted ? 'btn-primary' : 'btn-ghost'}`}>▲ {issue.upvoteCount} {issue.hasUpvoted ? 'Corroborated' : 'I see this too'}</button>
            <span className="text-sm text-slate-500">Reported by {issue.reporter?.name} {issue.reporter?.badges?.[0] && `· 🏅 ${issue.reporter.badges.at(-1)}`}</span>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-semibold">Progress</h2>
          <StatusTracker status={issue.status} />
          <ul className="space-y-1 text-sm text-slate-600">
            {issue.statusHistory?.map((h, k) => (
              <li key={k}>• <b>{h.status}</b> – {new Date(h.at).toLocaleString()} {h.by?.name && `by ${h.by.name}`} {h.note && `— ${h.note}`}</li>
            ))}
          </ul>
        </div>

        {issue.reports?.length > 0 && (
          <div className="card space-y-2">
            <h2 className="font-semibold">🔗 Merged duplicate reports ({issue.reports.length})</h2>
            {issue.reports.map((r, k) => (
              <div key={k} className="rounded-lg bg-slate-50 p-2 text-sm"><b>{r.user?.name || 'Resident'}</b>: {r.description}</div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="card space-y-2">
          <h2 className="font-semibold">Location</h2>
          <MapView height={220} issues={[issue]} center={[lat, lng]} zoom={16} />
          {issue.address && <p className="text-sm text-slate-600">{issue.address}</p>}
        </div>

        {isStaff && (
          <div className="card space-y-2">
            <h2 className="font-semibold">Staff actions</h2>
            <input className="input" placeholder="Update note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              {['Raised', 'In Progress', 'Completed'].map((s) => (
                <button key={s} disabled={s === issue.status} className="btn btn-ghost" onClick={() => setStatus(s)}>{s}</button>
              ))}
            </div>
            <button className="btn btn-primary w-full" onClick={async () => setHandoff(await api.get(`/issues/${id}/handoff`))}>📤 One-click handoff summary</button>
            <button className="btn btn-ghost w-full text-red-600" onClick={markSpam}>Mark as spam</button>
            {handoff && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Send to: <b>{handoff.department}</b></p>
                <textarea readOnly className="input h-48 font-mono text-xs" value={`${handoff.subject}\n\n${handoff.body}`} />
                <div className="flex gap-2">
                  <button className="btn btn-ghost flex-1" onClick={() => navigator.clipboard.writeText(handoff.body)}>Copy</button>
                  <a className="btn btn-primary flex-1" href={handoff.mailto}>Open email</a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
