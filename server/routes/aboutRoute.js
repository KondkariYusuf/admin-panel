// server/routes/aboutRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createAbout,
  getAbout,
  getAboutsPaginated,
  updateAbout,
  deleteAbout,
} = require("../controller/aboutController");

// Create About page (usually once) - JSON body
router.post("/", createAbout);

// Get singleton about page (by slug "about" or first doc)
router.get("/", getAbout);

// Paginated list of all About docs (for admin / future versions)
router.get("/list/all", getAboutsPaginated);

// Get specific About page by id
router.get("/:id", getAbout);

// Update singleton or by id (with optional file uploads)
router.put("/", upload.any(), updateAbout);
router.put("/:id", upload.any(), updateAbout);

// Delete singleton or by id
router.delete("/", deleteAbout);
router.delete("/:id", deleteAbout);

module.exports = router;
