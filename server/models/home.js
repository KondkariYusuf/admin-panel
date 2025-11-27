// server/models/Home.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

/* ---------- HERO (HeroOne) ---------- */

const HeroContentSchema = new Schema(
  {
    satisfiedClientsPercent: {
      type: Number,
      required: true,
      default: 98,
    },
    projectsCount: {
      type: Number,
      required: true,
      default: 120,
    },
    countriesCount: {
      type: Number,
      required: true,
      default: 24,
    },
    descriptionText: {
      type: String,
      required: true,
      default:
        "We’re a digital products design & development agency that works passionately with the digital experiences.",
    },
  },
  { _id: false }
);

/* ---------- ABOUT (AboutOne) ---------- */

const AboutContentSchema = new Schema(
  {
    bodyText: {
      type: String,
      required: true,
      default:
        "We’re a dynamic startup agency specializing in innovative solutions for businesses looking to elevate their brand presence. We offer a range of services including digital marketing, branding, web development, and creative strategy to help company",
    },
  },
  { _id: false }
);

/* ---------- VIDEO (VideoBox) ---------- */

const VideoContentSchema = new Schema(
  {
    videoUrl: {
      type: String,
      required: true,
      default: "https://rrdevs.net/project-video/group-meeting.mp4",
    },
  },
  { _id: false }
);

/* ---------- WORK AREA (WorkArea) ---------- */

// const WorkItemSchema = new Schema(
//   {
//     title: { type: String, required: true },          // "Panda Automap"
//     tag: { type: String, required: true },            // "Development"
//     imageUrl: { type: String, required: true },       // "/assets/imgs/project/image-1.webp"
//     year: { type: Number, default: 2025 },            // 2025
//     detailsUrl: { type: String, default: "/portfolio-details" },
//   },
//   { _id: false }
// );

// const WorkSectionSchema = new Schema(
//   {
//     heading: {
//       type: String,
//       required: true,
//       default: "Featured Work",
//     },
//     subheading: {
//       type: String,
//       required: true,
//       default: "Excellency in creative designs",
//     },
//     totalCount: {
//       type: Number,
//       required: true,
//       default: 26,
//     },
//     items: {
//       type: [WorkItemSchema],
//       default: [],
//     },
//     viewAllText: {
//       type: String,
//       required: true,
//       default: "View All Work",
//     },
//     viewAllUrl: {
//       type: String,
//       required: true,
//       default: "/portfolio",
//     },
//   },
//   { _id: false }
// );


/* ---------- SERVICES (ServiceArea) ---------- */

const ServiceItemSchema = new Schema(
  {
    number: {
      type: String,               // "(01)", "(02)"
      required: true,
    },

    title: {
      type: String,               // "Branding", "UI-UX Design"
      required: true,
    },

    list: {
      type: [String],             // ["Creative Direction", "Brand Identity", ...]
      required: true,
    },

    imageUrl: {
      type: String,               // "/assets/imgs/gallery/image-3.webp"
      required: true,
    },

    detailsUrl: {
      type: String,
      default: "/service-details",
    },
  },
  { _id: false }
);


const ServiceSectionSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      default: "Complex proficiency",
    },

    services: {
      type: [ServiceItemSchema],
      default: [],
    },
  },
  { _id: false }
);


/* ---------- PERFECT ACTIVITY (FunFactArea) ---------- */

const FunFactItemSchema = new Schema(
  {
    value: { type: String, required: true },      // "1.8M", "260+", "12+"
    text: { type: String, required: true },       // description text
  },
  { _id: false }
);

const FunFactSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Perfect —activity",
    },
    items: {
      type: [FunFactItemSchema],
      default: [],
    },
  },
  { _id: false }
);



/* ---------- CLIENTS (ClientArea) ---------- */

const ClientSectionSchema = new Schema(
  {
    // Paragraph text:
    // "We’re a great team of creatives with a strongest capabilities..."
    descriptionText: {
      type: String,
      required: true,
      default:
        "We’re a great team of creatives with a strongest capabilities to helping progressive fields achieve their goals. With the best talent on every project done successfully",
    },

    // Just the client / company names (for ClientCapsules)
    companyNames: {
      type: [String],   // ["Google", "Netflix", "Spotify", ...]
      default: [],
    },
  },
  { _id: false }
);



/* ---------- PARALLAX IMAGE (ParallaxImg) ---------- */

const ParallaxImageSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,          // "/assets/imgs/gallery/image-7.webp"
      default: "/assets/imgs/gallery/image-7.webp",
    },
    alt: {
      type: String,
      required: false,
      default: "image",
    },
  },
  { _id: false }
);

/* ---------- MAIN HOME SCHEMA ---------- */


const HomeSchema = new Schema(
  {
    slug: { type: String, default: "home", unique: true },

    hero: { type: HeroContentSchema, required: true },
    about: { type: AboutContentSchema, required: true },
    video: { type: VideoContentSchema, required: true },

    // workSection: { type: WorkSectionSchema, required: false },
    serviceSection: { type: ServiceSectionSchema, required: false },   // ✅ added here
    funFactSection: { type: FunFactSectionSchema, required: false },
    clientSection: { type: ClientSectionSchema, required: false }, // 👈 added here
    parallaxImage: { type: ParallaxImageSchema, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", HomeSchema);