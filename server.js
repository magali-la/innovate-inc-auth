// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const app = express()
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");

// DATABASE
// connect the database
mongoose.connect(process.env.MONGO_URI);

// DATABASE CONNECTION
// callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// MIDDLEWARE
// app needs to parse json data
app.use(express.json());

// ROUTES
app.use("/api/users", userRoutes);

// LISTENER - PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});