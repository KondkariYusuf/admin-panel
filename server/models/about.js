// server/models/About.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

/* ---------- PAGE TITLE (PageTitle) ---------- */

const PageTitleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "About",
    },
  },
  { _id: false }
);

/* ---------- ABOUT AREA DETAILS (AboutAreaDetails) ---------- */

const AboutInfoSchema = new Schema(
  {
    // e.g. ["Art Direction", "Capability", "Sustainability"]
    items: {
      type: [String],
      default: [],
      required: true,
    },
  },
  { _id: false }
);

const AboutGalleryImageSchema = new Schema(
  {
    imageUrl: {
      type: String, // "/assets/imgs/gallery/image-19.webp"
      required: true,
    },
    alt: {
      type: String,
      default: "about-gallery-image",
    },
  },
  { _id: false }
);

const AboutAreaDetailsSchema = new Schema(
  {
    // left column bullet list ("Art Direction", ...)
    infoList: {
      type: AboutInfoSchema,
      required: true,
      default: () => ({
        items: ["Art Direction", "Capability", "Sustainability"],
      }),
    },

    // right column paragraphs
    paragraphs: {
      type: [String],
      required: true,
      default: [
        "Sage Craft is the first and only creative agency for your real exploration. It’s one private place to save everything you can realize about digital beautifully design.",
        "As a global creative agency, we understand the importance of staying ahead of the game. That’s why we partner with some of the world's best talent to bring fresh ideas.",
      ],
    },

    // moving gallery images at the bottom
    galleryImages: {
      type: [AboutGalleryImageSchema],
      default: () => [
        { imageUrl: "/assets/imgs/gallery/image-19.webp", alt: "image-1" },
        { imageUrl: "/assets/imgs/gallery/image-20.webp", alt: "image-2" },
        { imageUrl: "/assets/imgs/gallery/image-21.webp", alt: "image-3" },
        { imageUrl: "/assets/imgs/gallery/image-22.webp", alt: "image-4" },
      ],
    },
  },
  { _id: false }
);

/* ---------- APPROACH AREA (ApproachAboutArea) ---------- */

const ApproachItemSchema = new Schema(
  {
    // Full title, e.g. "Problem discovery"
    title: {
      type: String,
      required: true,
    },

    // Whether to show the shape image badge (first two boxes)
    showShape: {
      type: Boolean,
      default: false,
    },

    // Bullet points list
    items: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

const ApproachSectionSchema = new Schema(
  {
    // Small subtitle above heading -> "Approach"
    subtitle: {
      type: String,
      required: true,
      default: "Approach",
    },

    heading: {
      type: String,
      required: true,
      default: "Method of making better result",
    },

    // List of approach boxes
    approaches: {
      type: [ApproachItemSchema],
      default: () => [
        {
          title: "Problem discovery",
          showShape: true,
          items: [
            "Usability Studies",
            "User Interviews",
            "Stakeholder Interviews",
            "Competitive Research",
            "Insights Report",
            "User Journey",
          ],
        },
        {
          title: "Design system ready",
          showShape: true,
          items: [
            "Thinking Workshops",
            "Sitemaps",
            "Concepts",
            "Designs",
            "Prototypes",
            "Usability Studies",
          ],
        },
        {
          title: "Design implementation",
          showShape: false,
          items: [
            "Design",
            "Use Cases",
            "User Flows",
            "Various User Types",
            "Annotations",
            "Interactions",
          ],
        },
      ],
    },
  },
  { _id: false }
);

/* ---------- INFO AREA (InfoAreaAbout) ---------- */

const InfoStatItemSchema = new Schema(
  {
    // e.g. "35+ Google reviews"
    label: {
      type: String,
      required: true,
    },
    // e.g. "4.9", "170+", "1.7k", "95%"
    value: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const InfoSectionSchema = new Schema(
  {
    subtitle: {
      type: String,
      required: true,
      default: "Who are we?",
    },
    heading: {
      type: String,
      required: true,
      default: "We deliver creative ideas to a crowded world.",
    },
    stats: {
      type: [InfoStatItemSchema],
      required: true,
      default: () => [
        { label: "35+ Google reviews", value: "4.9" },
        { label: "Clients world-wide", value: "170+" },
        { label: "Completed projects", value: "1.7k" },
        { label: "Client satisfaction", value: "95%" },
      ],
    },
  },
  { _id: false }
);

/* ---------- MEDIA AREA (MediaAboutArea) ---------- */

const MediaImageSchema = new Schema(
  {
    imageUrl: {
      type: String, // "/assets/imgs/gallery/image-23.webp"
      required: true,
      default: "/assets/imgs/gallery/image-23.webp",
    },
    alt: {
      type: String,
      default: "media-about-image",
    },
  },
  { _id: false }
);

const MediaSectionSchema = new Schema(
  {
    mediaImage: {
      type: MediaImageSchema,
      required: true,
      default: () => ({
        imageUrl: "/assets/imgs/gallery/image-23.webp",
        alt: "team-collaboration",
      }),
    },
    heading: {
      type: String,
      required: true,
      default:
        "Collaborate with a super down-to-earth, mad-talented team",
    },
    text: {
      type: String,
      required: true,
      default:
        "A collective bunch working on incredible projects and building enduring partnerships that extend well beyond the deliverable.",
    }
  },
  { _id: false }
);

/* ---------- AWARDS AREA (AwardArea) ---------- */

const AwardItemSchema = new Schema(
  {
    title: {
      type: String, // "7x Honorable Mention"
      required: true,
    },
    year: {
      type: String, // "2014"
      required: true,
    },
  },
  { _id: false }
);

const AwardCategorySchema = new Schema(
  {
    category: {
      type: String, // "Awwwards", "CSS Design", etc.
      required: true,
    },
    items: {
      type: [AwardItemSchema],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

const AwardsSectionSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      default:
        "We believe in quality, not quantity, that’s why we’re great ever.",
    },
    awards: {
      type: [AwardCategorySchema],
      required: true,
      default: () => [
        {
          category: "Awwwards",
          items: [
            { title: "7x Honorable Mention", year: "2014" },
            { title: "4x Site of the Day", year: "2016" },
            { title: "2x Developer Awards", year: "2016" },
            { title: "1x Site of the Year", year: "2019" },
            { title: "1x Design of the Year", year: "2025" },
          ],
        },
        {
          category: "CSS Design",
          items: [
            { title: "2x Website of the Day", year: "2014" },
            { title: "1x Best Innovation", year: "2016" },
            { title: "5x UX Design", year: "2016" },
            { title: "6x Creative Design", year: "2019" },
          ],
        },
        {
          category: "Dribbble",
          items: [
            { title: "2x Design of the Day", year: "2014" },
            { title: "2x Site of the Day", year: "2016" },
          ],
        },
        {
          category: "Behance",
          items: [{ title: "5x Featured Design", year: "2025" }],
        },
      ],
    },
  },
  { _id: false }
);

/* ---------- TEAM AREA (TeamArea) ---------- */

const TeamMemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // "/assets/imgs/team/team-1.webp"
      required: true,
    }
  },
  { _id: false }
);

const TeamSectionSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      default: "Meet the talented squad, behind the creativity",
    },
    description: {
      type: String,
      required: true,
      default:
        "We are a great skilled and talented team behind the creativity and your amazing digital craft.",
    },
    members: {
      type: [TeamMemberSchema],
      required: true,
      default: () => [
        {
          name: "James David",
          post: "CEO & Founder",
          imageUrl: "/assets/imgs/team/team-1.webp",
        },
        {
          name: "Brenda C. Janet",
          post: "Lead Developer",
          imageUrl: "/assets/imgs/team/team-2.webp",
        },
        {
          name: "Martin Carlos",
          post: "Lead Designer",
          imageUrl: "/assets/imgs/team/team-3.webp",
        },
        {
          name: "Garry J. Coburn",
          post: "Project Manager",
          imageUrl: "/assets/imgs/team/team-4.webp",
        },
      ],
    },
  },
  { _id: false }
);

/* ---------- MAIN ABOUT PAGE SCHEMA ---------- */

const AboutPageSchema = new Schema(
  {
    slug: { type: String, default: "about", unique: true },

    pageTitle: { type: PageTitleSchema, required: true },

    aboutArea: { type: AboutAreaDetailsSchema, required: true },

    approachSection: { type: ApproachSectionSchema, required: true },

    infoSection: { type: InfoSectionSchema, required: false },

    mediaSection: { type: MediaSectionSchema, required: false },

    awardsSection: { type: AwardsSectionSchema, required: false },

    teamSection: { type: TeamSectionSchema, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutPage", AboutPageSchema);
