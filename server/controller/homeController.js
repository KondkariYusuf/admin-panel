// server/controllers/homeController.js
const mongoose = require("mongoose");
const Home = require("../models/home");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getHomeDoc = async (homeId) => {
  // If an ID is passed, try by ID
  if (homeId) {
    if (!isValidId(homeId)) return null;
    return await Home.findById(homeId);
  }

  // Prefer slug "home"
  let home = await Home.findOne({ slug: "home" });
  if (!home) {
    home = await Home.findOne();
  }
  return home;
};

/* ---------- CREATE HOME ---------- */
// Typically you’ll only create this once
const createHome = async (req, res) => {
  try {
    const existing = await Home.findOne({ slug: "home" });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Home document already exists. Use update instead." });
    }

    const {
      hero,
      about,
      video,
      workSection,
      serviceSection,
      funFactSection,
      clientSection,
      parallaxImage,
    } = req.body || {};

    // Minimum required fields (as per schema)
    if (!hero || !about || !video) {
      return res.status(400).json({
        message: "hero, about and video sections are required to create home.",
      });
    }

    const newHome = new Home({
      hero,
      about,
      video,
      workSection,
      serviceSection,
      funFactSection,
      clientSection,
      parallaxImage,
    });

    await newHome.save();
    res.status(201).json({ message: "Home created", home: newHome });
  } catch (error) {
    console.error("createHome error:", error);
    res
      .status(500)
      .json({ message: "Error creating home", error: error.message });
  }
};

/* ---------- GET HOME ---------- */

const getHome = async (req, res) => {
  try {
    const homeId = req.params.id;
    const home = await getHomeDoc(homeId);
    if (!home) return res.status(404).json({ message: "Home not found" });
    res.status(200).json(home);
  } catch (error) {
    console.error("getHome error:", error);
    res
      .status(500)
      .json({ message: "Error fetching home", error: error.message });
  }
};

/* ---------- UPDATE HOME ---------- */

const updateHome = async (req, res) => {
  try {
    const homeId = req.params.id;
    const home = await getHomeDoc(homeId);
    if (!home) return res.status(404).json({ message: "Home not found" });

    const {
      hero,
      about,
      video,
      workSection,
      serviceSection,
      funFactSection,
      clientSection,
      parallaxImage,
      slug,
    } = req.body || {};

    // Merge nested objects to preserve existing fields
    if (hero) {
      home.hero = {
        ...(home.hero && home.hero.toObject
          ? home.hero.toObject()
          : home.hero),
        ...hero,
      };
    }

    if (about) {
      home.about = {
        ...(home.about && home.about.toObject
          ? home.about.toObject()
          : home.about),
        ...about,
      };
    }

    if (video) {
      home.video = {
        ...(home.video && home.video.toObject
          ? home.video.toObject()
          : home.video),
        ...video,
      };
    }

    if (workSection) {
      home.workSection = {
        ...(home.workSection && home.workSection.toObject
          ? home.workSection.toObject()
          : home.workSection),
        ...workSection,
      };
    }

    if (serviceSection) {
      home.serviceSection = {
        ...(home.serviceSection && home.serviceSection.toObject
          ? home.serviceSection.toObject()
          : home.serviceSection),
        ...serviceSection,
      };
    }

    if (funFactSection) {
      home.funFactSection = {
        ...(home.funFactSection && home.funFactSection.toObject
          ? home.funFactSection.toObject()
          : home.funFactSection),
        ...funFactSection,
      };
    }

    if (clientSection) {
      home.clientSection = {
        ...(home.clientSection && home.clientSection.toObject
          ? home.clientSection.toObject()
          : home.clientSection),
        ...clientSection,
      };
    }

    if (parallaxImage) {
      home.parallaxImage = {
        ...(home.parallaxImage && home.parallaxImage.toObject
          ? home.parallaxImage.toObject()
          : home.parallaxImage),
        ...parallaxImage,
      };
    }

    if (slug !== undefined) {
      home.slug = slug;
    }

    await home.save();
    res.status(200).json({ message: "Home updated", home });
  } catch (error) {
    console.error("updateHome error:", error);
    res
      .status(500)
      .json({ message: "Error updating home", error: error.message });
  }
};

/* ---------- DELETE HOME ---------- */

const deleteHome = async (req, res) => {
  try {
    const homeId = req.params.id;
    let deleted;

    if (homeId) {
      if (!isValidId(homeId))
        return res.status(400).json({ message: "Invalid home id" });
      deleted = await Home.findByIdAndDelete(homeId);
    } else {
      const first = await Home.findOne({ slug: "home" }) || (await Home.findOne());
      if (!first) return res.status(404).json({ message: "Home not found" });
      deleted = await Home.findByIdAndDelete(first._id);
    }

    if (!deleted) return res.status(404).json({ message: "Home not found" });

    res.status(200).json({ message: "Home deleted", home: deleted });
  } catch (error) {
    console.error("deleteHome error:", error);
    res
      .status(500)
      .json({ message: "Error deleting home", error: error.message });
  }
};

module.exports = {
  createHome,
  getHome,
  updateHome,
  deleteHome,
};
