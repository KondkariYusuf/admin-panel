const express = require("express");
const router = express.Router();

const Home = require("../models/home");
const About = require("../models/about");
const Portfolio = require("../models/portfolio");
const Service = require("../models/services");

router.get("/", async (req, res) => {
  try {
    const [home, about, portfolio, services] = await Promise.all([
      Home.findOne({ slug: "home" }) || Home.findOne(),
      About.findOne({ slug: "about" }) || About.findOne(),
      Portfolio.find(),
      Service.find(),
    ]);

    res.status(200).json({
      home,
      about,
      portfolio,
      services,
    });
  } catch (error) {
    console.error("Error in /api/all:", error);
    res.status(500).json({ message: "Error fetching all data", error });
  }
});

module.exports = router;
