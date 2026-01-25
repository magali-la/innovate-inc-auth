// import user model
const express = require("express");
const router = express.Router();
const User = require("../models/User.js");

// Token
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const expiration = '1h';

// middleware for authorization
const authMiddleware = require("../utils/auth.js");

// ROUTES - induces
// Create - post route for regisering new users in database
router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
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

// protected route using token, return user profile with the token
router.get("/me", authMiddleware, async (req, res) => {
    try {
        // if the auth middleware worked, the req user should exist, if it doesn't throw an error for non authenticated user
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // we shouldn't expose the password so remove this field for the user for easy display
        const user = await User.findById(req.user._id).select("-password");

        // return the user as a json object
        res.json(user);
    } catch (error) {
        // catch any server errors
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;