import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const link = ({ isActive }) => `rounded-md px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-[1000] border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-4 text-xl font-bold text-brand-700">🏙️ CivicForge</Link>
        <nav className="flex flex-wrap gap-1">
          <NavLink to="/" end className={link}>Feed</NavLink>
          <NavLink to="/priority" className={link}>🔥 Priority</NavLink>
          <NavLink to="/map" className={link}>Live Map</NavLink>
          <NavLink to="/leaderboard" className={link}>Heroes</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/report" className="btn btn-primary">+ Report issue</Link>
          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">
                {user.name} <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{user.role}</span>
              </span>
              <button className="btn btn-ghost" onClick={() => { logout(); nav('/'); }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-ghost">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
