const passport = require("passport");
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User.js');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    // This is the "verify" callback
    async (accessToken, refreshToken, profile, done) => {
      try {
        // The "profile" object contains the user's GitHub information
        const existingUser = await User.findOne({ githubId: profile.id });
 
        if (existingUser) {
          // If user already exists, pass them to the next middleware
          return done(null, existingUser);
        }

        // check if there's even an email, if the user has it private in their github settings it'll throw an undefined error, set a placeholder with data we can access for the database email field
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.username}@github.com`;
 
        // If it's a new user, create a record in our database
        const newUser = new User({
          githubId: profile.id,
          username: profile.username,
          email: email
        });
 
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);
 
// These functions are needed for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});
 
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});