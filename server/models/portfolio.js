
// const mongoose = require("mongoose");

// const RecentWorkSchema = new mongoose.Schema({
//   heading: { type: String, required: true },
//   subheading: { type: String, required: true },
//   services: [{ type: String }],       
  
// });

// const ProjectSchema = new mongoose.Schema({
//   title: { type: String, required: true },           
//   year: { type: Number, required: true },            
//   category: { type: String, required: true },        
//   imageUrl: { type: String, required: true },        
  
// });

// const PortfolioSchema = new mongoose.Schema({
//   recentWork: RecentWorkSchema,
//   projects: [ProjectSchema]
// });

// module.exports = mongoose.model("Portfolio", PortfolioSchema);

// //   example:
// //   {
// //     "recentWork": {
// //       "heading": "Creative works with our incredible people.",
// //       "subheading": "Creative works with our incredible people.",
// //       "services": ["Design", "Development", "Marketing", "Writing"],
// //       
// //     },
// //     "projects": [
// //       {
// //         "title": "Harash Denmark",
// //         "year": 2010,
// //         "category": "Branding",
// //         "imageUrl": "https://yourcdn.com/images/harash.webp"
// //       }
// //     ]
// //   }
  


// const mongoose = require("mongoose");

// const { Schema } = mongoose;

// /* ---------- Recent Work (page-level info) ---------- */

// const RecentWorkSchema = new Schema({
//   heading: { type: String, required: true },
//   subheading: { type: String, required: true },
//   // used in the "info list" on /portfolio
//   services: [{ type: String }],
// });

// /* ---------- Project detail sub-sections ---------- */

// const DetailSectionSchema = new Schema(
//   {
//     title: { type: String, required: true }, // e.g. "Visual Hierarchy"
//     text: { type: String, required: true },  // corresponding paragraph
//   },
//   { _id: false }
// );

// /* ---------- Project (each card / detail page) ---------- */

// const ProjectSchema = new Schema({
//   // List / card data
//   title: { type: String, required: true },          // e.g. "Saudi Venture Capital"
//   slug: { type: String, required: true, unique: true }, // e.g. "saudi-venture-capital"
//   year: { type: Number, required: true },           // e.g. 2010 (for grid display)
//   category: { type: String, required: true },       // e.g. "Marketing"
//   imageUrl: { type: String, required: true },       // main image (thumb + big hero image)

//   // Meta info (top right block)
//   serviceLabel: { type: String },                   // "Visual Identity, Branding"
//   client: { type: String },                         // "Softakey Digital Agency"
//   detailDate: { type: String },                     // "January 2025"
//   technologies: [{ type: String }],                 // ["Figma", "WordPress"]

//   // Overview section
//   overviewTitle: { type: String },                  // "Build streamline and evolve together with solution"
//   overviewText: { type: String },                   // long paragraph (Myriam text)
//   featureList: [{ type: String }],                  // ["Brand Development", "UX/UI Design", ...]

//   // Gallery (6 images in line)
//   galleryImages: [{ type: String }],                // array of image URLs

//   // Details sections (Visual Hierarchy / Components)
//   detailSections: [DetailSectionSchema],

//   // Final image at the bottom
//   finalImageUrl: { type: String },                  // last big image URL
// });

// /* ---------- Portfolio (page) ---------- */

// const PortfolioSchema = new Schema({
//   recentWork: RecentWorkSchema,
//   projects: [ProjectSchema],
// });

// module.exports = mongoose.model("Portfolio", PortfolioSchema);



// models/portfolio.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ---------- RECENT WORK ---------- */

const RecentWorkSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    subheading: {
      type: String,
      required: true,
    },
    services: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

/* ---------- DETAIL SECTIONS FOR PROJECT ---------- */

const DetailSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // 🔥 make text OPTIONAL so empty string is allowed
    text: {
      type: String,
      required: false,
      default: "",
    },
  },
  { _id: false }
);

/* ---------- PROJECT ---------- */

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    // for /portfolio-details/[slug]
    slug: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // allow multiple null/undefined
    },

    year: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    // 🔥 make imageUrl OPTIONAL so you can create a project without image first
    imageUrl: {
      type: String,
      required: false,
    },

    // Meta fields for details page
    serviceLabel: {
      type: String,
      required: false,
      default: "",
    },
    client: {
      type: String,
      required: false,
      default: "",
    },
    detailDate: {
      type: String,
      required: false,
      default: "",
    },

    // Arrays
    technologies: [
      {
        type: String,
      },
    ],

    overviewTitle: {
      type: String,
      required: false,
      default: "",
    },
    overviewText: {
      type: String,
      required: false,
      default: "",
    },

    featureList: [
      {
        type: String,
      },
    ],

    galleryImages: [
      {
        type: String,
      },
    ],

    detailSections: [DetailSectionSchema],

    finalImageUrl: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

/* ---------- PORTFOLIO ROOT ---------- */

const PortfolioSchema = new Schema(
  {
    recentWork: RecentWorkSchema,
    projects: [ProjectSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);
