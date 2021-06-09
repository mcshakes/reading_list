const express = require("express");
const localAuth = express.Router({ mergeParams: true });
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const db = require("../db");

// @desc Auth with email and password
// @route GET /auth/google/login
localAuth.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    
    // check if user exists
    const usernameExists = await findUsername(username)

    if (usernameExists) {
        return res.status(422).json({message: "This username exists"})
    }

    const emailExists = await findEmail(email)

    if (emailExists) {        
        return res.status(409).json({ message: "User with email already exists!" });
    }
    
    try {
        let savedUser = await db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
        [username, email, password])

        if (savedUser.rows[0]) {
            res.status(201).json({
                status: "success",
                data: savedUser.rows[0]
            })
        }
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ error: "Cannot register user at the moment!" });
    }
    
});


// @desc Auth with email and password
// @route GET /auth/google/login
// localAuth.get('/api/v1/auth/login', passport.authenticate('local'), );

module.exports = localAuth;

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            err ? reject(err) : resolve(hash)
        })
    })
}

const findUsername = async (username) => {
    await db.query(`SELECT * FROM users WHERE username = $1`, [username])
            .then((data) => data.rows[0])
}

const findEmail = async (email) => {
    await db.query(`SELECT * FROM users WHERE email = $1`, [email])
        .then((data) => data.rows[0])
}

const createUser = (user) => {
    return database.raw(
        "INSERT INTO users (username, password_digest, token, created_at) VALUES (?, ?, ?, ?) RETURNING id, username, created_at, token",
        [user.username, user.password_digest, user.token, new Date()]
      )
      .then((data) => data.rows[0])
}

const createToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, data) => {
            err ? reject(err) : resolve(data.toString("base64"))
        })
    })
}
