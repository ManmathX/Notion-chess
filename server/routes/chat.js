import { Router } from 'express';
import ChatSession from '../models/ChatSession.js';
import geminiService from '../services/geminiService.js';
import wsService from '../services/websocketService.js';

const router = Router();

// In-memory chat storage (fallback when MongoDB unavailable)
const inMemoryChats = new Map();

/**
 * POST /api/chat — Send a student message and get a Socratic coaching response
 * Body: { blunderData, message, sessionId? }
 */
router.post('/', async (req, res) => {
  try {
    const { blunderData, message, sessionId, gameId, blunderIndex } = req.body;
    
    if (!blunderData) {
      return res.status(400).json({ error: 'blunderData is required' });
    }
    
    // Get or create chat session
    let chatHistory = [];
    let currentSessionId = sessionId;
    
    if (currentSessionId && inMemoryChats.has(currentSessionId)) {
      chatHistory = inMemoryChats.get(currentSessionId);
    } else if (!currentSessionId) {
      currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      inMemoryChats.set(currentSessionId, []);
    }
    
    // If there's a student message, add it to history
    if (message) {
      chatHistory.push({ role: 'student', content: message, timestamp: new Date() });
    }
    
    // Get coaching response
    const coachResponse = await geminiService.getCoachingResponse(blunderData, chatHistory);
    
    // Add coach response to history
    const coachMsg = { role: 'coach', content: coachResponse, timestamp: new Date() };
    chatHistory.push(coachMsg);
    inMemoryChats.set(currentSessionId, chatHistory);
    
    // Broadcast via WebSocket for real-time updates
    wsService.sendCoachingUpdate(currentSessionId, coachMsg).catch(() => {});
    
    // Try to persist to MongoDB
    try {
      if (gameId) {
        await ChatSession.findOneAndUpdate(
          { gameId, blunderIndex: blunderIndex || 0 },
          { 
            messages: chatHistory,
            hintCount: chatHistory.filter(m => m.role === 'coach').length
          },
          { upsert: true, new: true }
        );
      }
    } catch (dbErr) {
      // DB save failed, but we have in-memory — that's fine
    }
    
    return res.json({
      sessionId: currentSessionId,
      response: coachResponse,
      hintCount: chatHistory.filter(m => m.role === 'coach').length,
      messages: chatHistory
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Coaching failed: ' + err.message });
  }
});

/**
 * GET /api/chat/:sessionId — Get chat history for a session
 */
router.get('/:sessionId', async (req, res) => {
  const history = inMemoryChats.get(req.params.sessionId);
  if (history) {
    return res.json({ sessionId: req.params.sessionId, messages: history });
  }
  
  try {
    const session = await ChatSession.findById(req.params.sessionId);
    if (session) {
      return res.json(session);
    }
  } catch {}
  
  return res.json({ sessionId: req.params.sessionId, messages: [] });
});

export default router;

