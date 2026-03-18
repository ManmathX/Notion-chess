import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * React hook for PieSocket WebSocket connection.
 * Connects to a coaching channel and provides real-time message updates.
 */
const useWebSocket = (channelId) => {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(async () => {
    if (!channelId) return;

    try {
      // Fetch WebSocket config from backend
      const res = await fetch('/api/ws-config');
      const { apiKey, wsBaseUrl } = await res.json();
      
      if (!apiKey) {
        console.log('No WebSocket API key configured');
        return;
      }

      const url = `${wsBaseUrl}/${channelId}?api_key=${apiKey}&notify_self=1`;
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log(`🔌 WebSocket connected to channel: ${channelId}`);
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Filter out system messages from PieSocket
          if (data.type && !data.info) {
            setLastMessage(data);
          }
        } catch {
          // Non-JSON message, ignore
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (channelId) connect();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.log('WebSocket error:', err);
        ws.close();
      };

      wsRef.current = ws;
    } catch (err) {
      console.log('Failed to setup WebSocket:', err);
    }
  }, [channelId]);

  // Connect when channel changes
  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  // Send message function
  const sendMessage = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
};

export default useWebSocket;
