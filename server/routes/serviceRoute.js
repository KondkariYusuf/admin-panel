// routes/serviceRoute.js
const express = require("express");
const router = express.Router();

const serviceController = require("../controller/serviceController");

// GET all service contents
router.get("/", serviceController.getAllServiceContents);

// GET one service content by ID
router.get("/:id", serviceController.getServiceContentById);

// POST create new service content
router.post("/", serviceController.createServiceContent);

// PUT update existing service content
router.put("/:id", serviceController.updateServiceContent);

// DELETE remove service content
router.delete("/:id", serviceController.deleteServiceContent);

module.exports = router;
