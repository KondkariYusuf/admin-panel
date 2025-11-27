// server/routes/homeRoutes.js
const express = require("express");
const router = express.Router();

const {
  createHome,
  getHome,
  updateHome,
  deleteHome,
} = require("../controller/homeController");

// Create home (usually once)
router.post("/", createHome);

// Get default "home" (by slug or first doc)
router.get("/", getHome);

// Get specific home by id
router.get("/:id", getHome);

// Update default home
router.put("/", updateHome);

// Update specific home by id
router.put("/:id", updateHome);

// Delete default home
router.delete("/", deleteHome);

// Delete specific home by id
router.delete("/:id", deleteHome);

module.exports = router;
