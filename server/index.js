import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import gamesRouter from './routes/games.js';
import analyzeRouter from './routes/analyze.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/games', gamesRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/chat', chatRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket config (serves PieSocket config to the frontend)
app.get('/api/ws-config', (req, res) => {
  res.json({
    apiKey: process.env.PIESOCKET_API_KEY || '',
    wsBaseUrl: 'wss://free.blr2.piesocket.com/v3'
  });
});

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🏰 Chess Academy server running on port ${PORT}`);
  });
};

start().catch(console.error);
