import { Router } from 'express';
import Game from '../models/Game.js';
import stockfishService from '../services/stockfishService.js';

const router = Router();

// In-memory store for analysis results (fallback)
const analysisCache = new Map();

/**
 * POST /api/analyze — Analyze a PGN directly (without saving to DB first)
 */
router.post('/', async (req, res) => {
  try {
    const { pgn } = req.body;
    
    if (!pgn || pgn.trim().length === 0) {
      return res.status(400).json({ error: 'PGN is required' });
    }
    
    console.log('🔍 Analyzing game...');
    const analysis = await stockfishService.analyzeGame(pgn);
    console.log(`✅ Analysis complete: ${analysis.blunders.length} blunders found`);
    
    return res.json({
      success: true,
      moves: analysis.moves,
      fens: analysis.fens,
      evaluations: analysis.evaluations,
      blunders: analysis.blunders,
      totalMoves: analysis.moves.length,
      blunderCount: analysis.blunders.length
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze game: ' + err.message });
  }
});

/**
 * POST /api/analyze/:gameId — Analyze a game already saved in the DB
 */
router.post('/:gameId', async (req, res) => {
  try {
    let game;
    try {
      game = await Game.findById(req.params.gameId);
    } catch {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    console.log(`🔍 Analyzing game ${req.params.gameId}...`);
    const analysis = await stockfishService.analyzeGame(game.pgn);
    
    // Update game in DB
    game.analyzed = true;
    game.blunders = analysis.blunders;
    game.evaluations = analysis.evaluations;
    game.moves = analysis.moves;
    game.fens = analysis.fens;
    await game.save();
    
    console.log(`✅ Game ${req.params.gameId} analyzed: ${analysis.blunders.length} blunders`);
    
    return res.json({
      success: true,
      game,
      blunderCount: analysis.blunders.length
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze game: ' + err.message });
  }
});

export default router;
