const express = require('express');
const connectDB = require('./config/config');
const cors = require('cors');
require("dotenv").config();

connectDB();


const app = express();


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/portfolio', require('./routes/portfolioRoute'));
app.use("/api/home", require("./routes/homeRoute"));
app.use("/api/about", require("./routes/aboutRoute"));
app.use("/api/service", require("./routes/serviceRoute"));


//start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));