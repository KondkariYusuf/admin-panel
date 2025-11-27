
const mongoose = require("mongoose");

const RecentWorkSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  subheading: { type: String, required: true },
  services: [{ type: String }],       
  
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },           
  year: { type: Number, required: true },            
  category: { type: String, required: true },        
  imageUrl: { type: String, required: true },        
  
});

const PortfolioSchema = new mongoose.Schema({
  recentWork: RecentWorkSchema,
  projects: [ProjectSchema]
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);

//   example:
//   {
//     "recentWork": {
//       "heading": "Creative works with our incredible people.",
//       "subheading": "Creative works with our incredible people.",
//       "services": ["Design", "Development", "Marketing", "Writing"],
//       
//     },
//     "projects": [
//       {
//         "title": "Harash Denmark",
//         "year": 2010,
//         "category": "Branding",
//         "imageUrl": "https://yourcdn.com/images/harash.webp"
//       }
//     ]
//   }
  