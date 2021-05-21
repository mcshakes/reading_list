const express = require("express");
const booksRouter = require("./controllers/books");
const readingListRouter = require("./controllers/readingLists")
const middleware = require('./utils/middleware')
const cors = require("cors");
const app = express();
const supertokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");
const {Google, Github, Facebook} = ThirdPartyEmailPassword;

supertokens.init({
        supertokens: {
            connectionURI: "https://try.supertokens.io",
        },
        appInfo: {
            // learn more about this on https://supertokens.io/docs/thirdpartyemailpassword/appinfo
            appName: "stuff",
            apiDomain: "www.localhost:3001",
            websiteDomain: "www.localhost:3000"
        },
        recipeList: [
            ThirdPartyEmailPassword.init({
                providers: [
                        Google({
                            clientSecret: "GOOGLE_CLIENT_SECRET",
                            clientId: "GOOGLE_CLIENT_ID"
                        })
                        // Github({
                        //     clientSecret: "GITHUB_CLIENT_SECRET",
                        //     clientId: "GITHUB_CLIENT_ID"
                        // })
                    ]
            }),
            Session.init() // initializes session features
        ]
});


app.use(function(req, res, next) {
    if (req.headers['content-type'] === 'application/json;') {
      req.headers['content-type'] = 'application/json';
    }
    next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));

app.use(cors({
  origin: "test",
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  credentials: true
}))

app.use(supertokens.middleware())
app.use(supertokens.errorHandler())

app.use(readingListRouter);
app.use(booksRouter);
app.use(middleware.unknownEndpoint)


module.exports = app;