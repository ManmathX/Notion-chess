import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Games
export const uploadGame = (pgn, playerWhite, playerBlack) =>
  api.post('/games', { pgn, playerWhite, playerBlack }).then(r => r.data);

export const getGames = () =>
  api.get('/games').then(r => r.data);

export const getGame = (id) =>
  api.get(`/games/${id}`).then(r => r.data);

// Analysis
export const analyzeGame = (pgn) =>
  api.post('/analyze', { pgn }).then(r => r.data);

export const analyzeGameById = (gameId) =>
  api.post(`/analyze/${gameId}`).then(r => r.data);

// Chat
export const sendChatMessage = (blunderData, message, sessionId, gameId, blunderIndex) =>
  api.post('/chat', { blunderData, message, sessionId, gameId, blunderIndex }).then(r => r.data);

export const getChatHistory = (sessionId) =>
  api.get(`/chat/${sessionId}`).then(r => r.data);

export default api;
