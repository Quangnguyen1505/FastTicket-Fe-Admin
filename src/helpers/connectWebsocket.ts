let ws: WebSocket | null = null;
import { env } from '@/env.mjs';

export const connectWebSocket = (
  sessionId: string,
  onNewMessage: (message: { sender_id: string; message: string; sent_at: string; event?: string }) => void
) => {
  if (ws) {
    ws.close();
    ws = null;
  }

  ws = new WebSocket(`${env.NEXT_PUBLIC_WEB_SOCKET_URL}?sessionId=${sessionId}`);

  ws.onopen = () => {
    console.log("✅ WebSocket connected!");
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("📨 New message:", message);
    onNewMessage(message);
  };

  ws.onerror = (err) => {
    console.error("⚠️ WebSocket error", err);
  };

  ws.onclose = () => {
    console.log("❌ WebSocket closed");
  };
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};
