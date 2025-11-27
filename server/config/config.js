//config/config.js
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/adminPanel'; 

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB is connected successfully.');
  } catch (err) {
    console.error(err.message);
  }
}


module.exports = connectDB;