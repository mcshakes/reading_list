const express = require("express");
const googleAuthRouter = express.Router({ mergeParams: true });
const passport = require("passport");

const db = require("../db/index");

const successLoginURL = "http://localhost:3000/login/success";  // This on React Side
const errorLoginURL = "http://localhost:3000/login/error";  // This on React Side

// authRouter.post("/api/v1/login", (req, res, next) {

// });

// authRouter.post("/api/v1/register", (req, res, next) {

// });

// @desc Auth with Google
// @route GET /auth/google
googleAuthRouter.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// @desc Google auth callback
// @route GET /auth/google/callback
googleAuthRouter.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: errorLoginURL,
        successRedirect: successLoginURL,
        failureMessage: "Can't login to Google, please try again later!" 
    }), 
    (req, res) => {
        console.log("User: ", req.user);
        res.send("thanks for signing in!"); 
    }
);


module.exports = googleAuthRouter;

// http://localhost:3001/auth/login/google is where I authenticate