import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES } from '../api.js';
import IssueCard from '../components/IssueCard.jsx';
import { useRealtime } from '../useRealtime.js';
import { useAuth } from '../auth.jsx';

const CATEGORY_ICON={roads:'🛣️',water:'💧',electricity:'⚡',waste:'🗑️',sanitation:'🚰',safety:'🚨',other:'📍'};
export default function Home(){
 const [issues,setIssues]=useState([]),[stats,setStats]=useState(null),[f,setF]=useState({status:'',category:'',sort:'new'}),[loading,setLoading]=useState(true),[error,setError]=useState('');const {user}=useAuth();
 const load=useCallback(()=>{const q=new URLSearchParams(Object.entries(f).filter(([,v])=>v));setError('');api.get(`/issues?${q}`).then(setIssues).catch(e=>setError(e.message)).finally(()=>setLoading(false));api.get('/stats').then(setStats).catch(()=>{});},[f]);
 useEffect(load,[load]);useRealtime(load);const s=stats?.byStatus||{};
 return <div className="space-y-8 pb-10">
  <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#123f32] px-6 py-8 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-11">
   <div className="absolute -right-14 -top-24 -z-10 h-80 w-80 rounded-full border-[38px] border-white/5"/><div className="absolute bottom-[-8rem] right-44 -z-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl"/>
   <div className="max-w-2xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-100"><span className="h-2 w-2 rounded-full bg-emerald-300"/>YOUR CITY, IN BETTER SHAPE</div>
    <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Small reports.<br/><span className="text-emerald-300">Real neighborhood change.</span></h1>
    <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">Spot a civic issue? Put it on the map. Neighbors can add support, and local teams can keep everyone posted as it gets resolved.</p>
    <div className="mt-6 flex flex-wrap gap-3"><Link to={user?'/report':'/register'} className="btn bg-white text-[#123f32] hover:bg-emerald-50">＋ Report an issue</Link><Link to="/map" className="btn border border-white/25 bg-white/5 text-white hover:bg-white/10">Explore the map&nbsp; ↗</Link></div>
   </div>
   <div className="mt-9 grid grid-cols-3 gap-2 border-t border-white/15 pt-5 sm:absolute sm:bottom-9 sm:right-9 sm:mt-0 sm:w-[24rem] sm:border-0 sm:pt-0">
    {[['Raised',s.Raised||0],['In progress',s['In Progress']||0],['Resolved',s.Completed||0]].map(([label,n],i)=><div key={label} className="rounded-2xl border border-white/10 bg-white/[.08] px-3 py-3 backdrop-blur"><div className="text-2xl font-bold sm:text-3xl">{n}</div><div className="mt-1 text-[11px] text-emerald-100/75 sm:text-xs">{label}</div></div>)}
   </div>
  </section>
  <section className="space-y-4">
   <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">Community pulse</p><h2 className="mt-1 text-2xl font-bold tracking-tight">What needs attention</h2></div><Link to="/priority" className="text-sm font-semibold text-emerald-800 hover:text-emerald-600">See urgent issues&nbsp; →</Link></div>
   <div className="flex gap-2 overflow-x-auto pb-1">{[['','All issues','✳'],...CATEGORIES.map(c=>[c,c[0].toUpperCase()+c.slice(1),CATEGORY_ICON[c]])].map(([value,label,icon])=><button key={value||'all'} onClick={()=>setF({...f,category:value})} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${f.category===value?'border-emerald-800 bg-emerald-800 text-white shadow-sm':'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-800'}`}><span>{icon}</span>{label}</button>)}</div>
   <div className="flex flex-wrap gap-2"><select aria-label="Filter by status" className="input w-auto min-w-36" value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option value="">Every status</option><option>Raised</option><option>In Progress</option><option>Completed</option></select><select aria-label="Sort issues" className="input w-auto min-w-40" value={f.sort} onChange={e=>setF({...f,sort:e.target.value})}><option value="new">Recently reported</option><option value="priority">Highest priority</option><option value="top">Most supported</option></select></div>
   {error?<div className="card text-sm text-red-700">Couldn’t load reports: {error} <button className="ml-2 font-semibold underline" onClick={load}>Try again</button></div>:loading?<div className="card text-sm text-slate-500">Loading community reports…</div>:issues.length===0?<div className="card py-12 text-center"><div className="text-3xl">🌱</div><p className="mt-3 font-semibold">No reports match these filters</p><p className="mt-1 text-sm text-slate-500">Try another category or be the first to report one.</p><Link className="mt-4 inline-flex text-sm font-semibold text-emerald-800" to="/report">Create a report&nbsp; →</Link></div>:<div className="grid gap-3">{issues.map(i=><IssueCard key={i._id} issue={i}/>)}</div>}
  </section>
 </div>;
}
