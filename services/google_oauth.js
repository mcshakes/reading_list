
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const db = require("../db/index");

const GOOGLE_CALLBACK_URL = "http://localhost:3001/auth/google/callback"

// module.exports = function(passport) {
passport.use(new GoogleStrategy({
  callbackURL: GOOGLE_CALLBACK_URL,  
  clientID: process.env.GOOGLE_CLIENT_ID, 
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  passReqToCallback: true
},

  async (req, accessToken, refreshToken, profile, done) => {
    // console.log("User Profile", profile)
    
    const defaultUser = {
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      email: profile.emails[0].value,
      googleId: profile.id,
    }

    const user = await db.query(`SELECT user FROM users WHERE google_id=${profile.id}`, (err,res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log("WHATS HERE?", res.rows[0])
      }
    })

    
    // try {

    //   let user_email = profile.emails && profile.emails[0].value; 
    //   let [user] = await db('users').select(['uuid', 'name', 'email']).where('email', user_email); 
    //   let redirect_url = "";

    //   if (user) {
    //     const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }); //generating token
    //     redirect_url = `http://localhost:3000/${token}` //registered on FE for auto-login
    //     return done(null, redirect_url);  //redirect_url will get appended to req.user object : passport.js in action
    //   } else {
    //     redirect_url = `http://localhost:3000/user-not-found/`;  // fallback page
    //     return done(null, redirect_url);
    //   }
    // } catch (error) {
    //   done(error)
    // }
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

// }
