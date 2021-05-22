const express = require("express");
const authRouter = express.Router({ mergeParams: true });

const db = require("../db/index");

// authRouter.post("/api/v1/login", (req, res, next) {

// });

// authRouter.post("/api/v1/register", (req, res, next) {

// });

authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
authRouter.get('/auth/google/redirect', passport.authenticate('google', 
    { session: false, failureRedirect: `https://localhost:3000/login` }), (req, res) => {
        res.redirect(req.user); //req.user has the redirection_url
});

module.exports = authRouter;