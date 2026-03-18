import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['coach', 'student'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  blunderIndex: { type: Number, required: true },
  messages: [messageSchema],
  resolved: { type: Boolean, default: false },
  hintCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);
