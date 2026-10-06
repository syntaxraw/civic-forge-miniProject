import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, CATEGORIES, LANGS } from '../api.js';
import MapView from '../components/MapView.jsx';
import { useAuth } from '../auth.jsx';

export default function Report() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'roads', address: '', language: user?.preferredLang || 'en' });
  const [pos, setPos] = useState(null);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const locate = () =>
    navigator.geolocation?.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setErr('Could not get your location — click on the map instead.')
    );

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!pos) return setErr('Please pick the issue location on the map.');
    const fd = new FormData();
    Object.entries({ ...form, lat: pos.lat, lng: pos.lng }).forEach(([k, v]) => fd.append(k, v));
    files.slice(0, 4).forEach((f) => fd.append('photos', f));
    setBusy(true);
    try {
      const r = await api.postForm('/issues', fd);
      if (r.merged) alert(r.message);
      if (r.flagged) alert('Your report was flagged by our spam filter and is awaiting review.');
      nav(`/issues/${r.issue._id}`);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
      <div className="card space-y-3">
        <h1 className="text-xl font-bold">Report a civic issue</h1>
        <input className="input" placeholder="Short title (e.g. Pothole near bus stop)" value={form.title} onChange={set('title')} required maxLength={140} />
        <textarea className="input h-28" placeholder="Describe the problem…" value={form.description} onChange={set('description')} required />
        <div className="grid grid-cols-2 gap-2">
          <select className="input" value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="input" value={form.language} onChange={set('language')}>{Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </div>
        <input className="input" placeholder="Landmark / address (optional)" value={form.address} onChange={set('address')} />
        <div>
          <label className="mb-1 block text-sm font-medium">Photos (up to 4)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files])} className="text-sm" />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Submitting…' : 'Submit report'}</button>
        <p className="text-xs text-slate-500">Similar reports nearby are merged automatically so authorities see one clean thread.</p>
      </div>
      <div className="card space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Location</h2>
          <button type="button" className="btn btn-ghost" onClick={locate}>📍 Use my location</button>
        </div>
        <MapView height={380} pick={pos} onPick={setPos} />
        <p className="text-xs text-slate-500">{pos ? `Selected: ${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}` : 'Click the map to drop a pin.'}</p>
      </div>
    </form>
  );
}
