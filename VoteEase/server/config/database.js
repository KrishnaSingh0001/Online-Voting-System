const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/votesecure');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Note: Make sure MongoDB is running on your system');
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = { connectDB };