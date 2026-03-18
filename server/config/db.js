import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chess_academy';
    await mongoose.connect(uri);
    console.log('📦 Connected to MongoDB:', uri);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Don't exit — allow server to start so frontend can work with mock data
    console.log('⚠️  Server will start without database. Using in-memory fallback.');
  }
};
