//config/config.js
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI; 

if (!mongoURI) {
  console.error('ERROR: MONGO_URI environment variable is not set.');
  console.error('Please set MONGO_URI in your .env file.');
  process.exit(1);
}

console.log("MongoDB URI configured.");

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB is connected successfully.');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;