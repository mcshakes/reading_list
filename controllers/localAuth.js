const express = require("express");
const localAuth = express.Router({ mergeParams: true });
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const db = require("../db");
const jwt = require("jsonwebtoken");


localAuth.post('/register', async (req, res) => {
    const { username, email, password } = req.body
        
    try {

        const hashedPassword = await hashPassword(password);

        let savedUser = await db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
        [username, email, hashedPassword])

        if (savedUser.rows[0]) {
            res.status(201).json({
                status: "success",
                data: savedUser.rows[0]
            })
        }
    } catch (err) {
        

        if (err.constraint === 'users_email_key') {
            return res.status(409).json({message: "A user with this email exists"})
        }

        if (err.constraint === 'users_username_key') {
            return res.status(422).json({message: "This username exists"})
        }
        
        console.log("unknown INSERT error: \n", err);
        res.status(500).json({ error: "Cannot register user at the moment!" });
    }
});

localAuth.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const foundUser = await findUsername(username)
        console.log("USER", foundUser)
        const unhashedPass = await checkPassword(password, foundUser);        
        console.log("PASS?", unhashedPass)

        
    } catch (err) {
            
        console.log("Error Loggin in: \n", err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = localAuth;

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            err ? reject(err) : resolve(hash)
        })
    })
}

const checkPassword = (reqPassword, foundUser) => {
    return new Promise((resolve, reject) =>
      bcrypt.compare(reqPassword, foundUser.password, (err, response) => {
          if (err) {
            reject(err)
          }
          else if (response) {
            resolve(response)
          } 
          else {
            reject(new Error('Passwords do not match.'))
          }
      })
    )
  }

const findUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
            .then((data) => data.rows[0])
}

const findEmail = async (email) => {
    await db.query(`SELECT * FROM users WHERE email = $1`, [email])
        .then((data) => data.rows[0])
}

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" })
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
