const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controller/otpController");

// STEP 1: Send OTP
router.post("/send-otp", sendOtp);

// STEP 2: Verify OTP & login
router.post("/verify-otp", verifyOtp);

module.exports = router;
