const express = require("express");
const googleAuthRouter = express.Router({ mergeParams: true });
const passport = require("passport");

const db = require("../db/index");

const successLoginURL = "http://localhost:3000/profile";  // This on React Side
const errorLoginURL = "http://localhost:3000/login/error";  // This on React Side


// @desc Auth with Google
// @route GET /auth/google/login
googleAuthRouter.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc Google auth callback
// @route GET /auth/google/callback
googleAuthRouter.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: errorLoginURL,
        failureMessage: "Can't login to Google, please try again later!" 
    }), 
    (req, res) => {
        console.log("User: ", req.user);
        res.redirect(successLoginURL); 
    }
);


module.exports = googleAuthRouter;

// http://localhost:3001/auth/google/login is where I authenticate