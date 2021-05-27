
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    callbackURL: `auth/google/callback`,  
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

    async (accessToken, refreshToken, profile, done) => {
      console.log("HEY!", profile)
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
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    console.log("USER TRYING TO DESERIALIZE", user)
  })

}
