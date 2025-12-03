const User = require("../models/admin");
const sendOtpMail = require("../utils/sendOtpMail");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 1 * 60 * 1000; // 1 minutes
    await user.save();

    await sendOtpMail(email, otp);
    console.log(otp);
    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // clear OTP after success
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // generate JWT used by RBAC
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "OTP Verified — Login Successful",
      token,
      role: user.role,
      id: user._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
