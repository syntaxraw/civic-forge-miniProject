import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { STATUS_COLOR } from '../api.js';

export const DEFAULT_CENTER = [28.6139, 77.209];

// Color-coded live civic map. Props: issues[], onSelect(issue), pick{lat,lng}, onPick({lat,lng}), height
export default function MapView({ issues = [], onSelect, pick, onPick, height = 480, center = DEFAULT_CENTER, zoom = 13 }) {
  const el = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const pickMarker = useRef(null);
  const cbs = useRef({});
  cbs.current = { onSelect, onPick };

  useEffect(() => {
    map.current = L.map(el.current).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    map.current.on('click', (e) => cbs.current.onPick?.({ lat: e.latlng.lat, lng: e.latlng.lng }));
    return () => map.current.remove();
  }, []);

  useEffect(() => {
    layer.current.clearLayers();
    issues.forEach((i) => {
      const [lng, lat] = i.location.coordinates;
      const m = L.circleMarker([lat, lng], {
        radius: 7 + Math.min(10, Math.sqrt(i.upvoteCount || 0) * 2),
        color: '#fff', weight: 2, fillColor: STATUS_COLOR[i.status], fillOpacity: 0.9,
      }).addTo(layer.current);
      m.bindTooltip(`<b>${i.title}</b><br/>${i.status} · ▲ ${i.upvoteCount}`);
      m.on('click', (e) => { L.DomEvent.stopPropagation(e); cbs.current.onSelect?.(i); });
    });
  }, [issues]);

  useEffect(() => {
    if (!pick) return;
    pickMarker.current?.remove();
    pickMarker.current = L.marker([pick.lat, pick.lng]).addTo(map.current);
    map.current.setView([pick.lat, pick.lng], Math.max(map.current.getZoom(), 15));
  }, [pick?.lat, pick?.lng]);

  return <div ref={el} style={{ height }} className="z-0 w-full overflow-hidden rounded-xl border" />;
}

export const Legend = () => (
  <div className="flex gap-4 text-xs text-slate-600">
    {Object.entries(STATUS_COLOR).map(([s, c]) => (
      <span key={s} className="flex items-center gap-1"><i className="inline-block h-3 w-3 rounded-full" style={{ background: c }} />{s}</span>
    ))}
    <span>Bigger dot = more community support</span>
  </div>
);
