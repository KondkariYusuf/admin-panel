require("dotenv").config();
const express = require('express');
const connectDB = require('./config/config');
const cors = require('cors');
//const otpRoutes = require("./server/routes/otpRoutes");

<<<<<<< HEAD
=======

>>>>>>> d37f086416d6727b5bd3a463500a53fa6a12c8ff

const { protect } = require("./middleware/authMiddleware");


connectDB();


const app = express();

// require("dotenv").config();
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/otp", require("./routes/otpRoutes"));

app.use('/api/portfolio', require('./routes/portfolioRoute'));
app.use("/api/home", require("./routes/homeRoute"));
app.use("/api/about", require("./routes/aboutRoute"));
app.use("/api/services", require("./routes/serviceRoute"));

app.use("/api/admin", require("./routes/adminRoute"));
<<<<<<< HEAD


app.use("/api/portfolio", require("./routes/portfolioRoute"));
app.use("/api/home", protect, require("./routes/homeRoute"));
app.use("/api/about", protect, require("./routes/aboutRoute"));
app.use("/api/services", protect, require("./routes/serviceRoute"));
=======
// Optional: if you want these routes protected by the `protect` middleware,
// uncomment the lines below and comment/remove the public routes above.
>>>>>>> d37f086416d6727b5bd3a463500a53fa6a12c8ff
// app.use("/api/portfolio", protect, require("./routes/portfolioRoute"));
// app.use("/api/home", protect, require("./routes/homeRoute"));
// app.use("/api/about", protect, require("./routes/aboutRoute"));
// app.use("/api/services", protect, require("./routes/serviceRoute"));
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/all", require("./routes/allRoute"));


//start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));