const express = require("express");
const booksRouter = require("./controllers/books");
const readingListRouter = require("./controllers/readingLists")
const middleware = require('./utils/middleware')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const googleAuthRouter = require("./controllers/googleAuth");
const cookieSession = require("cookie-session");

require("./services/google_oauth");

const app = express();
app.use(cors())

// app.use('*', function(req, res, next) {
//   //replace localhost:8080 to the ip address:port of your server
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', true);
//   next(); 
// });



app.use(function(req, res, next) {
    if (req.headers['content-type'] === 'application/json;') {
      req.headers['content-type'] = 'application/json';
    }
    next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));


// Sessions
app.use(cookieSession({
  maxAge: 24 * 60 *60 * 1000,
  keys: [process.env.COOKIE_KEY],
  name: "session"
}))

app.use(cookieParser());
// Passport MIddleware
app.use(passport.initialize())
app.use(passport.session())



app.use(readingListRouter);
app.use(booksRouter);
app.use("/auth", googleAuthRouter);
app.use(middleware.unknownEndpoint)


module.exports = app;