
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
      let user = await db.query(`SELECT user FROM users WHERE google_id=${profile.id}::VARCHAR`, (err,res) => {
        if (err) {
          console.log("user SELECTION error: ", err.stack)
        }     
      })


      if (user) {
        done(null, user)
      } 

      else {
        console.log("")
        console.log("WAS THERE USER? ", user)
        console.log("")

        user = await db.query(`INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3);`, 
        [newUser.name, newUser.email, newUser.googleId])

        done(null, user)
      }
    } catch (err) {
      console.error(err)
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
