const mongoose = require("mongoose");

const { Schema } = mongoose;

/* ---------- IMAGE SCHEMA ---------- */
const ImageSchema = new Schema(
  {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "",
    },
    width: Number,
    height: Number,
    speed: String,
  },
  { _id: false }
);

/* ---------- SERVICE CONTENT SCHEMA ---------- */
const ServiceContentSchema = new Schema(
  {
    leftImage: {
      type: ImageSchema,
      required: true,
    },

    paragraphs: {
      type: [String],
      required: true,
      validate: [(val) => val.length > 0, "At least one paragraph required"],
    },

    rightImage: {
      type: ImageSchema,
      required: true,
    },
  },
  { timestamps: true }
);

/* ---------- MAIN MODEL ---------- */
const ServiceContent =
  mongoose.models.ServiceContent ||
  mongoose.model("ServiceContent", ServiceContentSchema);

module.exports = ServiceContent;
