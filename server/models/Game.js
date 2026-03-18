import mongoose from 'mongoose';

const blunderSchema = new mongoose.Schema({
  moveNumber: Number,
  color: { type: String, enum: ['w', 'b'] },
  movePlayed: String,        // SAN notation e.g. "Nf3"
  bestMove: String,          // SAN notation e.g. "Bxf7+"
  fen: String,               // Position BEFORE the blunder
  evalBefore: Number,        // Eval in pawns before blunder
  evalAfter: Number,         // Eval in pawns after blunder
  evalDrop: Number,          // Absolute eval drop
  tacticalTheme: String      // e.g. "fork", "pin", "skewer"
});

const gameSchema = new mongoose.Schema({
  pgn: { type: String, required: true },
  playerWhite: { type: String, default: 'White' },
  playerBlack: { type: String, default: 'Black' },
  result: String,
  date: { type: Date, default: Date.now },
  analyzed: { type: Boolean, default: false },
  blunders: [blunderSchema],
  evaluations: [Number],     // Eval after each half-move
  moves: [String],           // SAN moves list
  fens: [String]             // FEN after each half-move
}, { timestamps: true });

export default mongoose.model('Game', gameSchema);
