const express = require("express");
const readingListRouter = express.Router({ mergeParams: true });

const db = require("../../db/index");

readingListRouter.get("/api/v1/lists", async (req, res) => {
    console.log("HERE")
    try {
        const results = await db.query("SELECT * FROM reading_list");

        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                reading_lists: results.rows
            }
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = readingListRouter;
