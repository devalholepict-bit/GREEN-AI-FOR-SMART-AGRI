const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️  Server will continue running without MongoDB.');
    console.error('⚠️  Please start MongoDB and restart the server for full functionality.');
  }
};

module.exports = connectDB;
