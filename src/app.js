const express = require("express");
const readingListRouter = require("./routes/readingLists")
const app = express();

app.use(function(req, res, next) {
    if (req.headers['content-type'] === 'application/json;') {
      req.headers['content-type'] = 'application/json';
    }
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));

app.use(readingListRouter);

module.exports = app;