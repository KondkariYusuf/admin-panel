require("dotenv").config();
const express = require('express');
const connectDB = require('./config/config');
const cors = require('cors');
//const otpRoutes = require("./server/routes/otpRoutes");


const { protect, authorizeRoles } = require("./middleware/authMiddleware");


connectDB();


const app = express();

// require("dotenv").config();
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//routes-unprotected
// app.use("/api/otp", require("./routes/otpRoutes"));

app.use('/api/portfolio', require('./routes/portfolioRoute'));
// app.use("/api/home", require("./routes/homeRoute"));
// app.use("/api/about", require("./routes/aboutRoute"));
// app.use("/api/services", require("./routes/serviceRoute"));
// app.use("/api/admin", require("./routes/adminRoute"));
// app.use("/api/auth", require("./routes/authRoute"));
// app.use("/api/all", require("./routes/allRoute"));


// ✅ Public auth routes (login, register)
app.use("/api/auth", require("./routes/authRoute"));

// ✅ Protected admin routes - only authenticated + authorized admins
app.use("/api/admin", protect, authorizeRoles("admin"), require("./routes/adminRoute"));

// ✅ Protected content routes - only authenticated admins
app.use("/api/portfolio", protect, authorizeRoles("admin"), require("./routes/portfolioRoute"));
app.use("/api/home", protect, authorizeRoles("admin"), require("./routes/homeRoute"));
app.use("/api/about", protect, authorizeRoles("admin"), require("./routes/aboutRoute"));
app.use("/api/services", protect, authorizeRoles("admin"), require("./routes/serviceRoute"));

// ✅ Optional public all-routes endpoint
app.use("/api/all", require("./routes/allRoute"));


//start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));