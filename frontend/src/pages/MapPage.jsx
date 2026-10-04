import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import MapView, { Legend } from '../components/MapView.jsx';
import { useRealtime } from '../useRealtime.js';

export default function MapPage() {
  const [issues, setIssues] = useState([]);
  const nav = useNavigate();
  const load = useCallback(() => api.get('/issues/map').then(setIssues), []);
  useEffect(() => { load(); }, [load]);
  useRealtime(load); // markers update live over WebSocket

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Live Civic Map</h1>
        <Legend />
      </div>
      <MapView issues={issues} height={560} onSelect={(i) => nav(`/issues/${i._id}`)} />
    </div>
  );
}
