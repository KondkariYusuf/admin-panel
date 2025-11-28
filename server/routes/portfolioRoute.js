// routes/portfolioRoute.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const controller = require("../controller/portfolioController");

// Portfolio CRUD
// Create portfolio (supports multipart for images)
router.post("/", upload.any(), controller.createPortfolio);

// Get default portfolio (first doc)
router.get("/", controller.getPortfolio);

// Get portfolio by id
router.get("/:id", controller.getPortfolio);

// Update default portfolio (no id) with multipart
router.put("/", upload.any(), controller.updatePortfolio);

// Update portfolio by id with multipart
router.put("/:id", upload.any(), controller.updatePortfolio);

// Delete portfolio by id
router.delete("/:id", controller.deletePortfolio);

// Projects (subdocuments) – keep JSON-based for now
router.post("/:id/projects", controller.addProject);
router.get("/:id/projects", controller.getAllProjects);
router.get("/:portfolioId/projects/:projectId", controller.getProjectById);
router.put("/:portfolioId/projects/:projectId", controller.updateProject);
router.delete("/:portfolioId/projects/:projectId", controller.deleteProject);

module.exports = router;
