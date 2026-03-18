import WebSocket from 'ws';

/**
 * PieSocket WebSocket service for real-time coaching communication.
 * Enables live updates when coach and student are on the same analysis page.
 */
class WebSocketService {
  constructor() {
    this.wsUrl = process.env.PIESOCKET_WS_URL;
    this.apiKey = process.env.PIESOCKET_API_KEY;
    this.connections = new Map(); // channelId -> WebSocket
  }

  /**
   * Get the WebSocket URL for a specific channel
   */
  getChannelUrl(channelId) {
    const baseUrl = 'wss://free.blr2.piesocket.com/v3';
    return `${baseUrl}/${channelId}?api_key=${this.apiKey}&notify_self=1`;
  }

  /**
   * Broadcast a message to a coaching channel
   */
  async broadcast(channelId, data) {
    return new Promise((resolve, reject) => {
      const url = this.getChannelUrl(channelId);
      const ws = new WebSocket(url);

      ws.on('open', () => {
        ws.send(JSON.stringify(data));
        console.log(`📡 Broadcast to channel ${channelId}:`, data.type);
        ws.close();
        resolve();
      });

      ws.on('error', (err) => {
        console.error('WebSocket broadcast error:', err.message);
        reject(err);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) ws.close();
        reject(new Error('WebSocket broadcast timeout'));
      }, 5000);
    });
  }

  /**
   * Send a coaching update event
   */
  async sendCoachingUpdate(sessionId, message) {
    try {
      await this.broadcast(`coaching_${sessionId}`, {
        type: 'coaching_message',
        sessionId,
        message,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      // Non-critical — log and continue
      console.log('WebSocket broadcast skipped:', err.message);
    }
  }

  /**
   * Send an analysis complete event
   */
  async sendAnalysisComplete(gameId, blunderCount) {
    try {
      await this.broadcast(`game_${gameId}`, {
        type: 'analysis_complete',
        gameId,
        blunderCount,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.log('WebSocket broadcast skipped:', err.message);
    }
  }
}

export default new WebSocketService();
