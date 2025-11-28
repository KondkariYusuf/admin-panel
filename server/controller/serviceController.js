// controllers/serviceController.js
const ServiceContent = require("../models/services");

// @desc    Get all service contents
// @route   GET /api/services
// @access  Public (change if you add auth)
exports.getAllServiceContents = async (req, res) => {
  try {
    const services = await ServiceContent.find();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching service contents:", error);
    res.status(500).json({ message: "Server error while fetching services" });
  }
};

// @desc    Get a single service content by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceContentById = async (req, res) => {
  try {
    const service = await ServiceContent.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service content not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service content by ID:", error);
    res.status(500).json({ message: "Server error while fetching service" });
  }
};

// @desc    Create a new service content
// @route   POST /api/services
// @access  Private (if admin panel etc.)
exports.createServiceContent = async (req, res) => {
  try {
    const { leftImage, paragraphs, rightImage } = req.body;

    if (!leftImage || !rightImage || !paragraphs || !paragraphs.length) {
      return res.status(400).json({
        message:
          "leftImage, rightImage and at least one paragraph are required",
      });
    }

    const service = await ServiceContent.create({
      leftImage,
      paragraphs,
      rightImage,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("Error creating service content:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Server error while creating service" });
  }
};

// @desc    Update a service content
// @route   PUT /api/services/:id
// @access  Private
exports.updateServiceContent = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedService = await ServiceContent.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service content not found" });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error updating service content:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Server error while updating service" });
  }
};

// @desc    Delete a service content
// @route   DELETE /api/services/:id
// @access  Private
exports.deleteServiceContent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await ServiceContent.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service content not found" });
    }

    res.status(200).json({ message: "Service content deleted successfully" });
  } catch (error) {
    console.error("Error deleting service content:", error);
    res.status(500).json({ message: "Server error while deleting service" });
  }
};
