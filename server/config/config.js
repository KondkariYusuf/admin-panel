//config/config.js
const mongoose = require('mongoose');

// const mongoURI = 'mongodb+srv://devteam_db_user:cSvIHgoaFX48RuO4@sage.81ahy6f.mongodb.net/?appName=sage'; 
// const mongoURI = process.env.MONGO_URI;
const mongoURI = 'mongodb://localhost:27017/adminPanel';
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




