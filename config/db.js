const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI exists and doesn't contain placeholder
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI || mongoURI.includes('<db_password>')) {
      console.log('⚠️  No valid MongoDB URI found in environment variables');
      console.log('📝 To fix this, you have two options:');
      console.log('   1. Install and start MongoDB locally');
      console.log('   2. Set up MongoDB Atlas and update your .env file');
      console.log('');
      console.log('🚀 For now, the server will start without database connection');
      console.log('   API endpoints will return errors until MongoDB is connected');
      return; // Don't exit, just skip database connection
    }

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check if your MongoDB URI is correct');
    console.log('   2. Verify your MongoDB credentials');
    console.log('   3. Ensure MongoDB service is running');
    console.log('');
    console.log('🚀 Server will continue without database connection');
    console.log('   Update your .env file and restart to connect to MongoDB');
  }
};

module.exports = connectDB;