import { useEffect, useRef } from 'react';

// Subscribes to the Express WebSocket; calls `onEvent` for issue:new / issue:update.
export function useRealtime(onEvent) {
  const ref = useRef(onEvent);
  ref.current = onEvent;
  useEffect(() => {
    let ws, retry, closed = false;
    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      ws = new WebSocket(`${proto}://${location.host}/ws`);
      ws.onmessage = (e) => { try { ref.current(JSON.parse(e.data)); } catch {} };
      ws.onclose = () => { if (!closed) retry = setTimeout(connect, 2000); };
    };
    connect();
    return () => { closed = true; clearTimeout(retry); ws?.close(); };
  }, []);
}
