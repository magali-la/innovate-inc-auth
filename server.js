// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const app = express()
const mongoose = require("mongoose");
// Token
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const expiration = '1h'

// import user model
const User = require("./models/User.js");

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

// ROUTES - induces
// Create - post route for regisering new users in database
app.post("/api/users/register", async (req, res) => {
    try {
        // check if the user exists already from the email - remove the password from this fetch for security
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            // throw error that user already exists
            console.log("User already exists with email");
            return res.status(400).json({ message: "User exists with this email" })
        } else {
            // if not, then create the user
            const newUser = await User.create(req.body);
            console.log("New user successfully created");
            // response w success code for post method and only show the user and email
            res.status(201).json({ username: newUser.username, email: newUser.email });
        }
    } catch (error) {
        console.error("Error adding new user", error);
        res.status(400).json({ message: error.message });
    }
});

// login route
app.post("/api/users/login", async (req, res) => {
    try {
        // make sure the req.body only includes email and password fields
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email: req.body.email });
 
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password" });
        }
        
        const correctPw = await user.isCorrectPassword(req.body.password);
        
        if (!correctPw) {
            return res.status(400).json({ message: "Incorrect email or password" });
        } 

        // token logic to run once user is found and passwords match
        // this is what will be returned without the password
        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };

        // assign the token
        const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });

        // response is the json object with the token and the user, but as payload without the password
        res.json({ token, user: payload });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// LISTENER - PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});