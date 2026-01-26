const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


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
    // password can't be required if the user logs in with github where a password field isn't shared. make a validator function that either takes the githubId as the password or the actual password if they login with email/password
    password: {
        type: String,
        minlength: 8,
        validate: {
          validator: function(password) {
            // if the user being created has a githubid in its req.body, then its coming from oauth and it's valid
            // if no githubid then do a regular check if a password exists
            return this.githubId || password;
          }
        }
    }
});

// add bcrypt to salt and hash user's password
// Set up pre-save middleware to create password
userSchema.pre("save", async function () {
  // github users wont have a password field so add a check for the password existing first to run the salting and hashing
  if (this.password && (this.isNew || this.isModified("password"))) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

// add password verification - comparison logic
// Compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;