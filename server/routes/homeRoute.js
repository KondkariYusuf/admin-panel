// server/routes/homeRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createHome,
  getHome,
  updateHome,
  deleteHome,
} = require("../controller/homeController");


// Protect all routes below this line
const { protect } = require("../middleware/authMiddleware");
router.use(protect);


// Create home (usually once) - JSON body
router.post("/", createHome);

// Get default "home" (by slug or first doc)
router.get("/", getHome);

// Get specific home by id
router.get("/:id", getHome);

// Update default home (with optional file uploads)
router.put("/", upload.any(), updateHome);

// Update specific home by id (with optional file uploads)
router.put("/:id", upload.any(), updateHome);

// Delete default home
router.delete("/", deleteHome);

// Delete specific home by id
router.delete("/:id", deleteHome);

module.exports = router;
