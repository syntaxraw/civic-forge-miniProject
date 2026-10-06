import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Priority from './pages/Priority.jsx';
import MapPage from './pages/MapPage.jsx';
import Report from './pages/Report.jsx';
import IssueDetail from './pages/IssueDetail.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import { Login, Register } from './pages/AuthPages.jsx';
import { useAuth } from './auth.jsx';

function Private({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/priority" element={<Priority />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/report" element={<Private><Report /></Private>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
