// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const app = express()
const mongoose = require("mongoose");

// LISTENER - PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});