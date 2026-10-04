import { WebSocketServer } from 'ws';

let wss;

export function initRealtime(server) {
  wss = new WebSocketServer({ server, path: '/ws' });
  wss.on('connection', (ws) => ws.send(JSON.stringify({ type: 'hello' })));
}

export function broadcast(type, payload) {
  if (!wss) return;
  const msg = JSON.stringify({ type, payload });
  wss.clients.forEach((c) => c.readyState === 1 && c.send(msg));
}
