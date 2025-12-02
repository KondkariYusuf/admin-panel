//config/config.js
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI; 
console.log("MongoDB URI:", mongoURI);
async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB is connected successfully.');
  } catch (err) {
    console.error(err.message);
  }
}


module.exports = connectDB;