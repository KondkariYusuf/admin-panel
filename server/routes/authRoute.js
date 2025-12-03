// const express = require("express");
// const { loginAdmin } = require("../controller/authController");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/login", loginAdmin);

// // ✅ Token verification route
// router.get("/verify", protect, (req, res) => {
//   return res.json({
//     ok: true,
//     admin: req.admin, // e.g. { id: '...' }
//   });
// });

// module.exports = router;


const express = require("express");
const {
  loginAdmin,
  forgotPassword,
  resetPassword,
  logoutAdmin,
} = require("../controller/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

// Logout (clears cookie + server session)
router.post("/logout", protect, logoutAdmin);

// 🔹 Forgot password (no auth needed)
router.post("/forgot-password", forgotPassword);

// 🔹 Reset password (no auth needed)
router.post("/reset-password", resetPassword);

// ✅ Token verification route
router.get("/verify", protect, (req, res) => {
  return res.json({
    ok: true,
    admin: req.admin, // e.g. { id: '...' }
  });
});

module.exports = router;
