// server/controllers/aboutController.js
const mongoose = require("mongoose");
const AboutPage = require("../models/about"); // adjust path/case if needed

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAboutDoc = async (aboutId) => {
  // If an ID is passed, try by ID
  if (aboutId) {
    if (!isValidId(aboutId)) return null;
    return await AboutPage.findById(aboutId);
  }

  // Prefer slug "about"
  let about = await AboutPage.findOne({ slug: "about" });
  if (!about) {
    about = await AboutPage.findOne();
  }
  return about;
};

/* ---------- CREATE ABOUT PAGE ---------- */
// Typically you’ll only create this once
const createAbout = async (req, res) => {
  try {
    const existing = await AboutPage.findOne({ slug: "about" });
    if (existing) {
      return res
        .status(400)
        .json({ message: "About page already exists. Use update instead." });
    }

    const {
      pageTitle,
      aboutArea,
      approachSection,
      infoSection,
      mediaSection,
      awardsSection,
      teamSection,
    } = req.body || {};

    // Minimum required to create (rest will fall back to schema defaults)
    if (!pageTitle || !aboutArea || !approachSection) {
      return res.status(400).json({
        message:
          "pageTitle, aboutArea and approachSection are required to create About page.",
      });
    }

    const newAbout = new AboutPage({
      pageTitle,
      aboutArea,
      approachSection,
      infoSection,
      mediaSection,
      awardsSection,
      teamSection,
    });

    await newAbout.save();
    res.status(201).json({ message: "About page created", about: newAbout });
  } catch (error) {
    console.error("createAbout error:", error);
    res
      .status(500)
      .json({ message: "Error creating About page", error: error.message });
  }
};

/* ---------- GET SINGLE ABOUT PAGE (singleton-style) ---------- */

const getAbout = async (req, res) => {
  try {
    const aboutId = req.params.id;
    const about = await getAboutDoc(aboutId);
    if (!about) return res.status(404).json({ message: "About page not found" });
    res.status(200).json(about);
  } catch (error) {
    console.error("getAbout error:", error);
    res
      .status(500)
      .json({ message: "Error fetching About page", error: error.message });
  }
};

/* ---------- GET ABOUT PAGES PAGINATED (for future multi-about/admin) ---------- */

const getAboutsPaginated = async (req, res) => {
  try {
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const [total, aboutPages] = await Promise.all([
      AboutPage.countDocuments(),
      AboutPage.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      aboutPages,
    });
  } catch (error) {
    console.error("getAboutsPaginated error:", error);
    res.status(500).json({
      message: "Error fetching About pages with pagination",
      error: error.message,
    });
  }
};

/* ---------- UPDATE ABOUT PAGE ---------- */

const updateAbout = async (req, res) => {
  try {
    const aboutId = req.params.id;
    const about = await getAboutDoc(aboutId);
    if (!about) return res.status(404).json({ message: "About page not found" });

    const {
      pageTitle,
      aboutArea,
      approachSection,
      infoSection,
      mediaSection,
      awardsSection,
      teamSection,
      slug,
    } = req.body || {};

    // Helper to merge nested objects safely
    const mergeSection = (current, incoming) => {
      if (!incoming) return current;
      const base =
        current && current.toObject ? current.toObject() : current || {};
      return { ...base, ...incoming };
    };

    if (pageTitle) {
      about.pageTitle = mergeSection(about.pageTitle, pageTitle);
    }

    if (aboutArea) {
      about.aboutArea = mergeSection(about.aboutArea, aboutArea);
    }

    if (approachSection) {
      about.approachSection = mergeSection(
        about.approachSection,
        approachSection
      );
    }

    if (infoSection) {
      about.infoSection = mergeSection(about.infoSection, infoSection);
    }

    if (mediaSection) {
      about.mediaSection = mergeSection(about.mediaSection, mediaSection);
    }

    if (awardsSection) {
      about.awardsSection = mergeSection(about.awardsSection, awardsSection);
    }

    if (teamSection) {
      about.teamSection = mergeSection(about.teamSection, teamSection);
    }

    if (slug !== undefined) {
      about.slug = slug;
    }

    await about.save();
    res.status(200).json({ message: "About page updated", about });
  } catch (error) {
    console.error("updateAbout error:", error);
    res
      .status(500)
      .json({ message: "Error updating About page", error: error.message });
  }
};

/* ---------- DELETE ABOUT PAGE ---------- */

const deleteAbout = async (req, res) => {
  try {
    const aboutId = req.params.id;
    let deleted;

    if (aboutId) {
      if (!isValidId(aboutId))
        return res.status(400).json({ message: "Invalid about id" });
      deleted = await AboutPage.findByIdAndDelete(aboutId);
    } else {
      const first =
        (await AboutPage.findOne({ slug: "about" })) ||
        (await AboutPage.findOne());
      if (!first) return res.status(404).json({ message: "About page not found" });
      deleted = await AboutPage.findByIdAndDelete(first._id);
    }

    if (!deleted)
      return res.status(404).json({ message: "About page not found" });

    res.status(200).json({ message: "About page deleted", about: deleted });
  } catch (error) {
    console.error("deleteAbout error:", error);
    res
      .status(500)
      .json({ message: "Error deleting About page", error: error.message });
  }
};

module.exports = {
  createAbout,
  getAbout,
  getAboutsPaginated,
  updateAbout,
  deleteAbout,
};
