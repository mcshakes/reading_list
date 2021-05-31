
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const db = require("../db/index");

const GOOGLE_CALLBACK_URL = "http://localhost:3001/auth/google/callback"

passport.use(new GoogleStrategy({
  callbackURL: GOOGLE_CALLBACK_URL,  
  clientID: process.env.GOOGLE_CLIENT_ID, 
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  passReqToCallback: true
},

  async (req, accessToken, refreshToken, profile, done) => {
    // console.log("User Profile", profile)
    
    const newUser = {
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      email: profile.emails[0].value,
      googleId: profile.id,
    }

    try {
        let results = await db.query(`SELECT * FROM users WHERE google_id=${profile.id}::VARCHAR`)

        if (results.rows.length) {
          console.log("")
          console.log("User Exists within users table", results.rows)
          done(null, results.rows[0])
        } 

        else {
          console.log("")
          console.log("No USER found. Must create new User in DB ", results.rows)

          let user = await db.query(`INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING id, name, email, google_id;`, 
          [newUser.name, newUser.email, newUser.googleId])

          done(null, user.rows[0])
        }
    } catch (err) {
        console.log("")
        console.error("Google Auth Error with PG: ", err)
    }
   
  }
));  

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  // console.log("USER TRYING TO DESERIALIZE", user)

  const user = db.query(`SELECT user FROM users WHERE id=${id}`, (err,res) => {
    if (err) {
      console.log("ERROR DESERIALIZE USER", err)
      done(err, null);
    }

    console.log("USER DESERIALIZE", user);
  })

  if (user) done(null, user);
})
