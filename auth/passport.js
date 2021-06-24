const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require('jsonwebtoken');
const db = require("../db/index");
const bcrypt = require("bcrypt");

passport.use(new LocalStrategy({
    usernameField: "user[email]",
    passwordField: "user[password]"
}, (email, password, done) => {
    
    try {
        let results = await db.query(`SELECT * FROM users WHERE email=${email}`);
        
        if (results.rows.length > 0) {
            
            let retUser = results.rows[0]
            console.log("")
            console.log("User Exists within users table", retUser)

            bcrypt.compare(password, retUser.password, (err, res) => {
                if (res) {
                    done(null, retUser)
                } else {
                    done(null, false)
                }
            })
            done(null, results.rows[0])
        } else {
            console.log("No such user")
            console.log(results)
        } 

    } catch (err) {
        console.log("")
        console.error("Passport Local error stemming from PG: ", err)
    }

}))

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    done(null, user.id)
  })
  
passport.deserializeUser((id, done) => {


db.query(`SELECT * FROM users WHERE id=${id}`)
    .then(response => {
    done(null, response.rows[0])
    })
    .catch(err => {
        console.log(err)
    })

})
  