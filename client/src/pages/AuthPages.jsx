import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { LANGS } from '../api.js';

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await login(f.email, f.password); nav('/'); } catch (x) { setErr(x.message); }
  };
  return (
    <form onSubmit={submit} className="card mx-auto max-w-sm space-y-3">
      <h1 className="text-xl font-bold">Login</h1>
      <input className="input" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
      <input className="input" type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn btn-primary w-full">Login</button>
      <p className="text-sm text-slate-500">New here? <Link to="/register" className="text-brand-600">Create an account</Link></p>
    </form>
  );
}

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', preferredLang: 'en', role: 'citizen', staffCode: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try { await register(f); nav('/'); } catch (x) { setErr(x.message); }
  };
  return (
    <form onSubmit={submit} className="card mx-auto max-w-sm space-y-3">
      <h1 className="text-xl font-bold">Create account</h1>
      <input className="input" placeholder="Full name" value={f.name} onChange={set('name')} required />
      <input className="input" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
      <input className="input" type="password" placeholder="Password (6+ chars)" value={f.password} onChange={set('password')} required />
      <select className="input" value={f.preferredLang} onChange={set('preferredLang')}>{Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select className="input" value={f.role} onChange={set('role')}>
        <option value="citizen">Citizen</option><option value="authority">Authority staff</option><option value="ngo">NGO volunteer</option>
      </select>
      {f.role !== 'citizen' && <input className="input" placeholder="Staff invite code" value={f.staffCode} onChange={set('staffCode')} />}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn btn-primary w-full">Sign up</button>
    </form>
  );
}
