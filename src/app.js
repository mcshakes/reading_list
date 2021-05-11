const express = require("express");
const readingListRouter = require("./routes/readingLists")
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.json({ type: 'application/vnd.api+json' }));

app.use(readingListRouter);

module.exports = app;