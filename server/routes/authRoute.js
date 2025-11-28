const express = require("express");
const { loginAdmin } = require("../controller/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

// ✅ Token verification route
router.get("/verify", protect, (req, res) => {
  return res.json({
    ok: true,
    admin: req.admin, // e.g. { id: '...' }
  });
});

module.exports = router;
