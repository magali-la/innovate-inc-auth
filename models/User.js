const mongoose = require("mongoose");

// set up schema with user info
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: 4
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;