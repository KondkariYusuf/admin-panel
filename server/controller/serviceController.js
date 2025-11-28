// controllers/serviceController.js
const ServiceContent = require("../models/services");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const uploadBufferToCloudinary = (buffer, folder, resource_type = "image") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

exports.getAllServiceContents = async (req, res) => {
  try {
    const service = await ServiceContent.findOne();
    if (!service) {
      return res.status(404).json({ message: "Service content not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service contents:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching services" });
  }
};

// @desc    Get a single service content by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceContentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    const service = await ServiceContent.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service content not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service content by ID:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching service" });
  }
};

// @desc    Create or update singleton service content (upsert, multipart)
// @route   POST /api/services
// @access  Private
exports.createServiceContent = async (req, res) => {
  try {
    let incoming;

    // multipart: payload is JSON string
    if (req.body && req.body.payload) {
      try {
        incoming = JSON.parse(req.body.payload);
      } catch (e) {
        return res.status(400).json({ message: "Invalid JSON in payload" });
      }
    } else {
      incoming = req.body || {};
    }

    let { leftImage, paragraphs, rightImage } = incoming;
    const files = req.files || [];

    const leftFile = files.find((f) => f.fieldname === "leftImage");
    const rightFile = files.find((f) => f.fieldname === "rightImage");

    // Upload left image if file present
    if (leftFile) {
      const uploaded = await uploadBufferToCloudinary(
        leftFile.buffer,
        "services/left",
        "image"
      );
      leftImage = {
        ...(leftImage || {}),
        src: uploaded.secure_url,
      };
    }

    // Upload right image if file present
    if (rightFile) {
      const uploaded = await uploadBufferToCloudinary(
        rightFile.buffer,
        "services/right",
        "image"
      );
      rightImage = {
        ...(rightImage || {}),
        src: uploaded.secure_url,
      };
    }

    // Basic validation: require at least one paragraph
    if (!paragraphs || !Array.isArray(paragraphs) || !paragraphs.length) {
      return res
        .status(400)
        .json({ message: "At least one paragraph is required" });
    }

    // Upsert singleton: update first doc if exists, otherwise create new
    let existing = await ServiceContent.findOne();

    if (existing) {
      // Merge leftImage
      if (leftImage) {
        const currentLeft =
          existing.leftImage && existing.leftImage.toObject
            ? existing.leftImage.toObject()
            : existing.leftImage || {};
        existing.leftImage = { ...currentLeft, ...leftImage };
        existing.markModified("leftImage");
      }

      // Replace paragraphs
      if (paragraphs) {
        existing.paragraphs = paragraphs;
        existing.markModified("paragraphs");
      }

      // Merge rightImage
      if (rightImage) {
        const currentRight =
          existing.rightImage && existing.rightImage.toObject
            ? existing.rightImage.toObject()
            : existing.rightImage || {};
        existing.rightImage = { ...currentRight, ...rightImage };
        existing.markModified("rightImage");
      }

      await existing.save();
      return res
        .status(200)
        .json({ message: "Service content updated", serviceInfo: existing });
    }

    // No existing doc -> create new
    const service = await ServiceContent.create({
      leftImage,
      paragraphs,
      rightImage,
    });

    res
      .status(201)
      .json({ message: "Service content created", serviceInfo: service });
  } catch (error) {
    console.error("Error creating/updating service content:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res
      .status(500)
      .json({ message: "Server error while creating service" });
  }
};

// @desc    Update a service content by ID (JSON or multipart)
// @route   PUT /api/services/:id
// @access  Private
exports.updateServiceContent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    let incoming;
    if (req.body && req.body.payload) {
      try {
        incoming = JSON.parse(req.body.payload);
      } catch (e) {
        return res.status(400).json({ message: "Invalid JSON in payload" });
      }
    } else {
      incoming = req.body || {};
    }

    let { leftImage, paragraphs, rightImage } = incoming;
    const files = req.files || [];

    const leftFile = files.find((f) => f.fieldname === "leftImage");
    const rightFile = files.find((f) => f.fieldname === "rightImage");

    if (leftFile) {
      const uploaded = await uploadBufferToCloudinary(
        leftFile.buffer,
        "services/left",
        "image"
      );
      leftImage = {
        ...(leftImage || {}),
        src: uploaded.secure_url,
      };
    }

    if (rightFile) {
      const uploaded = await uploadBufferToCloudinary(
        rightFile.buffer,
        "services/right",
        "image"
      );
      rightImage = {
        ...(rightImage || {}),
        src: uploaded.secure_url,
      };
    }

    const existing = await ServiceContent.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Service content not found" });
    }

    // Merge leftImage
    if (leftImage) {
      const currentLeft =
        existing.leftImage && existing.leftImage.toObject
          ? existing.leftImage.toObject()
          : existing.leftImage || {};
      existing.leftImage = { ...currentLeft, ...leftImage };
      existing.markModified("leftImage");
    }

    // Replace paragraphs if provided
    if (paragraphs && Array.isArray(paragraphs)) {
      existing.paragraphs = paragraphs;
      existing.markModified("paragraphs");
    }

    // Merge rightImage
    if (rightImage) {
      const currentRight =
        existing.rightImage && existing.rightImage.toObject
          ? existing.rightImage.toObject()
          : existing.rightImage || {};
      existing.rightImage = { ...currentRight, ...rightImage };
      existing.markModified("rightImage");
    }

    await existing.save();

    res
      .status(200)
      .json({ message: "Service content updated", serviceInfo: existing });
  } catch (error) {
    console.error("Error updating service content:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res
      .status(500)
      .json({ message: "Server error while updating service" });
  }
};

// @desc    Delete a service content
// @route   DELETE /api/services/:id
// @access  Private
exports.deleteServiceContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid service id" });
    }

    const deletedService = await ServiceContent.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service content not found" });
    }

    res
      .status(200)
      .json({ message: "Service content deleted successfully" });
  } catch (error) {
    console.error("Error deleting service content:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting service" });
  }
};
