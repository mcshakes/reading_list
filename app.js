const express = require("express");
const booksRouter = require("./controllers/books");
const readingListRouter = require("./controllers/readingLists")
const middleware = require('./utils/middleware')
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
app.use(booksRouter);
app.use(middleware.unknownEndpoint)


module.exports = app;