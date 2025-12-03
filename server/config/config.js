//config/config.js
const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://devteam_db_user:cSvIHgoaFX48RuO4@sage.81ahy6f.mongodb.net/?appName=sage"; 
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




