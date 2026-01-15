import { useEffect, useMemo, useRef } from 'react';
import store from 'store2';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

function useWebSocket({
  url = SOCKET_URL,
  onOpen,
  onMessage,
  onError,
  onClose,
  dependencies = [],
}) {
  const wsRef = useRef(null);
  const keyRef = useRef('');
  const connectingRef = useRef(false);
  const unmountedRef = useRef(false);
  const token = store.get('token');

  const deviceStr = useMemo(() => {
    const list = Array.isArray(dependencies)
      ? dependencies.flatMap((d) => (d ? String(d).split(',') : []))
      : String(dependencies || '').split(',');
    return [...new Set(list.map((s) => s.trim()).filter(Boolean))].sort().join(',');
  }, [dependencies]);

  const key = useMemo(() => {
    return deviceStr ? `${url}?deviceIds=${deviceStr}&token=${token}` : '';
  }, [url, deviceStr]);

  useEffect(() => {
    unmountedRef.current = false;

    if (!key) return;

    // Prevent duplicate connection
    if (
      wsRef.current &&
      keyRef.current === key &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING ||
        connectingRef.current)
    ) {
      console.log('[WS] Already connected or connecting:', key);
      return;
    }

    // Close old socket if key changed
    if (wsRef.current && keyRef.current !== key) {
      console.log('[WS] Closing old socket due to key change:', keyRef.current);
      try {
        wsRef.current.close();
      } catch {
        // Ignore errors
      }
      wsRef.current = null;
    }

    console.log('[WS] Connecting to:', key);
    connectingRef.current = true;
    keyRef.current = key;

    const ws = new WebSocket(key);
    wsRef.current = ws;

    ws.onopen = () => {
      connectingRef.current = false;
      if (unmountedRef.current) {
        console.log('[WS] Connected but unmounted, closing:', key);
        try {
          ws.close();
        } catch {
          // Ignore errors
        }
        return;
      }
      console.log('[WS] Connected:', key);
      onOpen?.(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data, ws);
      } catch {
        onMessage?.(event.data, ws);
      }
    };

    ws.onerror = (err) => {
      connectingRef.current = false;
      console.error('[WS] Error:', err);
      onError?.(err, ws);
    };

    ws.onclose = () => {
      connectingRef.current = false;
      if (wsRef.current === ws) wsRef.current = null;
      console.log('[WS] Disconnected:', key);
      onClose?.(ws);
    };

    return () => {
      unmountedRef.current = true;
      connectingRef.current = false;
      if (wsRef.current) {
        console.log('[WS] Cleanup: Closing socket on unmount:', key);
        try {
          wsRef.current.close();
        } catch {
          // Ignore errors
        }
        wsRef.current = null;
      }
      keyRef.current = '';
    };
  }, [key, onOpen, onMessage, onError, onClose]);

  return wsRef.current;
}

export default useWebSocket;
