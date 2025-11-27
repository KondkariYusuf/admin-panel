const express = require('express');
const connectDB = require('./config/config');
const cors = require('cors');

connectDB();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/portfolio', require('./routes/portfolioRoute'));
app.use("/api/home", require("./routes/homeRoute"));
app.use("/api/about", require("./routes/aboutRoutes"));


//start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));