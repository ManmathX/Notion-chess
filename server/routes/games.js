import { Router } from 'express';
import Game from '../models/Game.js';

const router = Router();

// In-memory fallback when MongoDB is unavailable
let inMemoryGames = [];
let nextId = 1;

/**
 * POST /api/games — Upload a PGN and save to database
 */
router.post('/', async (req, res) => {
  try {
    const { pgn, playerWhite, playerBlack } = req.body;
    
    if (!pgn || pgn.trim().length === 0) {
      return res.status(400).json({ error: 'PGN is required' });
    }
    
    try {
      const game = await Game.create({
        pgn,
        playerWhite: playerWhite || 'Student',
        playerBlack: playerBlack || 'Opponent',
        date: new Date()
      });
      return res.status(201).json(game);
    } catch (dbErr) {
      // MongoDB fallback
      const game = {
        _id: String(nextId++),
        pgn,
        playerWhite: playerWhite || 'Student',
        playerBlack: playerBlack || 'Opponent',
        date: new Date(),
        analyzed: false,
        blunders: [],
        evaluations: [],
        moves: [],
        fens: []
      };
      inMemoryGames.push(game);
      return res.status(201).json(game);
    }
  } catch (err) {
    console.error('Error saving game:', err);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

/**
 * GET /api/games — List all games
 */
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 }).select('-pgn');
    return res.json(games);
  } catch {
    return res.json(inMemoryGames.map(g => ({ ...g, pgn: undefined })));
  }
});

/**
 * GET /api/games/:id — Get a single game with full details
 */
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      const memGame = inMemoryGames.find(g => g._id === req.params.id);
      if (memGame) return res.json(memGame);
      return res.status(404).json({ error: 'Game not found' });
    }
    return res.json(game);
  } catch {
    const memGame = inMemoryGames.find(g => g._id === req.params.id);
    if (memGame) return res.json(memGame);
    return res.status(404).json({ error: 'Game not found' });
  }
});

export default router;
