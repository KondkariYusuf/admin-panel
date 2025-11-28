// server/utils/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,      // e.g. "your_cloud_name"
  api_key: process.env.CLOUDINARY_API_KEY,           // put your key here via .env
  api_secret: process.env.CLOUDINARY_API_SECRET,     // NEVER commit this
});

module.exports = cloudinary;
