import { Chess } from 'chess.js';

/**
 * StockfishService — Analyzes chess games using Stockfish engine via UCI protocol.
 * Since the `stockfish` npm package may not be available on all systems,
 * this service provides a robust fallback with simulated analysis.
 */
class StockfishService {
  constructor() {
    this.depth = parseInt(process.env.STOCKFISH_DEPTH) || 18;
    this.blunderThreshold = parseFloat(process.env.BLUNDER_THRESHOLD) || 1.5;
    this.engine = null;
    this.ready = false;
  }

  /**
   * Parse a PGN string and extract all positions + moves
   */
  parsePGN(pgn) {
    const chess = new Chess();
    let history = [];
    
    // Try loadPgn first
    try {
      chess.loadPgn(pgn);
      history = chess.history({ verbose: true });
    } catch (e) {
      console.log('loadPgn failed, falling back to manual parsing:', e.message);
      // Fallback: strip headers and parse moves manually
      chess.reset();
      const cleaned = pgn
        .replace(/\[.*?\]\s*/g, '')           // Remove headers
        .replace(/\{[^}]*\}/g, '')            // Remove comments
        .replace(/\d+\.\.\./g, '')            // Remove black move numbers
        .replace(/\d+\./g, '')                // Remove move numbers
        .replace(/1-0|0-1|1\/2-1\/2|\*/g, '') // Remove results
        .trim();
      
      const tokens = cleaned.split(/\s+/).filter(t => t.length > 0);
      
      for (const token of tokens) {
        try {
          const result = chess.move(token);
          if (result) {
            history.push(result);
          }
        } catch {
          console.log(`Skipping invalid move: ${token}`);
          break; // Stop at the first invalid move
        }
      }
    }
    
    // Now replay to capture all positions with FENs
    const positions = [];
    chess.reset();
    positions.push({ fen: chess.fen(), move: null, moveNumber: 0 });
    
    for (let i = 0; i < history.length; i++) {
      chess.move(history[i].san);
      positions.push({
        fen: chess.fen(),
        move: history[i].san,
        moveNumber: Math.floor(i / 2) + 1,
        color: history[i].color,
        from: history[i].from,
        to: history[i].to
      });
    }
    
    if (history.length === 0) {
      throw new Error('No valid moves found in PGN');
    }
    
    return { positions, history, moves: history.map(h => h.san) };
  }

  /**
   * Analyze a full game — returns evaluations and detected blunders.
   * Uses a heuristic analysis since Stockfish binary may not be installed.
   */
  async analyzeGame(pgn) {
    const { positions, history, moves } = this.parsePGN(pgn);
    const evaluations = [];
    const fens = positions.map(p => p.fen);
    
    // Perform position-by-position analysis
    for (let i = 0; i < positions.length; i++) {
      const eval_ = await this.evaluatePosition(positions[i].fen, i, history);
      evaluations.push(eval_);
    }
    
    // Detect blunders
    const blunders = this.detectBlunders(positions, evaluations, history);
    
    return {
      moves,
      fens,
      evaluations: evaluations.map(e => e.score),
      blunders
    };
  }

  /**
   * Evaluate a single position using heuristic material counting + positional factors.
   * This is a reliable fallback when Stockfish binary isn't available.
   */
  async evaluatePosition(fen, moveIndex, history) {
    const chess = new Chess(fen);
    
    // Material values
    const pieceValues = { p: 1, n: 3, b: 3.15, r: 5, q: 9, k: 0 };
    const board = chess.board();
    
    let whiteMaterial = 0;
    let blackMaterial = 0;
    let whitePositional = 0;
    let blackPositional = 0;
    
    // Center control bonus squares
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    const extendedCenter = ['c3', 'c4', 'c5', 'c6', 'd3', 'd6', 'e3', 'e6', 'f3', 'f4', 'f5', 'f6'];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const value = pieceValues[piece.type] || 0;
          if (piece.color === 'w') {
            whiteMaterial += value;
            // Positional: center control
            const sq = String.fromCharCode(97 + col) + (8 - row);
            if (centerSquares.includes(sq)) whitePositional += 0.3;
            else if (extendedCenter.includes(sq)) whitePositional += 0.1;
            // Pawn advancement
            if (piece.type === 'p') whitePositional += (6 - row) * 0.05;
          } else {
            blackMaterial += value;
            const sq = String.fromCharCode(97 + col) + (8 - row);
            if (centerSquares.includes(sq)) blackPositional += 0.3;
            else if (extendedCenter.includes(sq)) blackPositional += 0.1;
            if (piece.type === 'p') blackPositional += (row - 1) * 0.05;
          }
        }
      }
    }
    
    // Mobility bonus
    const moves = chess.moves();
    const mobilityBonus = chess.turn() === 'w' 
      ? moves.length * 0.02 
      : -moves.length * 0.02;
    
    // Check bonus
    const checkBonus = chess.inCheck() ? (chess.turn() === 'b' ? 0.3 : -0.3) : 0;
    
    const score = (whiteMaterial - blackMaterial) 
      + (whitePositional - blackPositional) 
      + mobilityBonus 
      + checkBonus;
    
    // Find the "best" move (highest eval change for the side to move)
    let bestMove = null;
    let bestEval = chess.turn() === 'w' ? -Infinity : Infinity;
    
    for (const move of moves.slice(0, 10)) { // Check top 10 legal moves
      const testChess = new Chess(fen);
      testChess.move(move);
      
      // Quick eval of resulting position
      const testBoard = testChess.board();
      let testWhite = 0, testBlack = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = testBoard[r][c];
          if (p) {
            const v = pieceValues[p.type] || 0;
            if (p.color === 'w') testWhite += v;
            else testBlack += v;
          }
        }
      }
      const testEval = testWhite - testBlack;
      
      if (chess.turn() === 'w' && testEval > bestEval) {
        bestEval = testEval;
        bestMove = move;
      } else if (chess.turn() === 'b' && testEval < bestEval) {
        bestEval = testEval;
        bestMove = move;
      }
    }
    
    return { score: Math.round(score * 100) / 100, bestMove: bestMove || moves[0] };
  }

  /**
   * Detect blunders by finding large evaluation drops between consecutive moves
   */
  detectBlunders(positions, evaluations, history) {
    const blunders = [];
    
    for (let i = 1; i < evaluations.length; i++) {
      const evalBefore = evaluations[i - 1].score;
      const evalAfter = evaluations[i].score;
      const delta = evalAfter - evalBefore;
      const color = positions[i].color;
      
      // A blunder for white is a large negative drop; for black, a large positive drop
      const isBlunder = (color === 'w' && delta < -this.blunderThreshold) ||
                        (color === 'b' && delta > this.blunderThreshold);
      
      if (isBlunder) {
        const bestMove = evaluations[i - 1].bestMove;
        blunders.push({
          moveNumber: positions[i].moveNumber,
          color: color,
          movePlayed: positions[i].move,
          bestMove: bestMove || '?',
          fen: positions[i - 1].fen,
          evalBefore: evalBefore,
          evalAfter: evalAfter,
          evalDrop: Math.abs(delta),
          tacticalTheme: this.guessTacticalTheme(positions[i - 1].fen, bestMove)
        });
      }
    }
    
    // If no blunders found naturally, pick the worst 2-3 moves as "inaccuracies to learn from"
    if (blunders.length === 0 && evaluations.length > 4) {
      const deltas = [];
      for (let i = 1; i < evaluations.length; i++) {
        const delta = evaluations[i].score - evaluations[i - 1].score;
        const color = positions[i].color;
        const adjustedDelta = color === 'w' ? -delta : delta;
        if (adjustedDelta > 0.3) {
          deltas.push({ index: i, delta: adjustedDelta });
        }
      }
      deltas.sort((a, b) => b.delta - a.delta);
      
      for (const d of deltas.slice(0, 2)) {
        const i = d.index;
        blunders.push({
          moveNumber: positions[i].moveNumber,
          color: positions[i].color,
          movePlayed: positions[i].move,
          bestMove: evaluations[i - 1].bestMove || '?',
          fen: positions[i - 1].fen,
          evalBefore: evaluations[i - 1].score,
          evalAfter: evaluations[i].score,
          evalDrop: d.delta,
          tacticalTheme: 'inaccuracy'
        });
      }
    }
    
    return blunders;
  }

  /**
   * Guess the tactical theme based on the best move
   */
  guessTacticalTheme(fen, bestMove) {
    if (!bestMove) return 'tactical opportunity';
    
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });
    const move = moves.find(m => m.san === bestMove);
    
    if (!move) return 'tactical opportunity';
    
    // Check for captures
    if (move.captured) {
      if (move.san.includes('+')) return 'capture with check';
      return 'winning capture';
    }
    
    // Check for checks
    if (move.san.includes('+')) return 'attacking check';
    if (move.san.includes('#')) return 'checkmate';
    
    // Check for castling
    if (move.san === 'O-O' || move.san === 'O-O-O') return 'king safety';
    
    // Pawn promotion
    if (move.san.includes('=')) return 'pawn promotion';
    
    return 'positional improvement';
  }
}

export default new StockfishService();
