const express = require("express");
const readingListRouter = express.Router({ mergeParams: true });
const { verify } = require("../middleware/authenticate");
const db = require("../db/index");
const { insertReadingList } = require("../db/db-utils");


// *********************************************************************************
// @desc GET all shelves regardless of authentication
// @route GET /shelves
// *********************************************************************************
readingListRouter.get("/shelves", async (req, res) => {

    try {
        const results = await db.query("SELECT * FROM shelves");

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

// *********************************************************************************
// @desc Create a shelf as Authenticated User
// @route POST /users/:id/shelves
// *********************************************************************************
readingListRouter.post("/users/:id/shelves", verify, async (req, res) => {
    const { name, list_type } = req.body;
    const { id }  = req.params;

    if (req.body === undefined) {
        return res.status(400).json({ error: "content missing"})
    }


    try {
        const results = await db.query("INSERT INTO shelves (name, list_type, user_id) values ($1, $2, $3) returning *", 
                            [name, list_type, id]);

        res.status(201).json({
            status: "success",
            data: results.rows[0]
        })
    } catch (err) {
        console.log(err)
    }
  
})

// *********************************************************************************
// @desc See a User's shelves WITHOUT authentication
// @route GET /users/:id/shelves
// *********************************************************************************
readingListRouter.get("/users/:id/shelves", async (req, res) => {
    const { id } = req.params

    try {
        const results = await db.query("SELECT * FROM shelves WHERE user_id=$1", [id]);

        res.status(200).json({
            status: "success",
            data: results.rows
        })
    } catch (err) {
        console.log(err)
    }
})


readingListRouter.get("/api/v1/lists/:id", async (req, res) => {

    try {
        const results = await db.query("SELECT * FROM reading_lists WHERE id = $1", [req.params.id]);

        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: results.rows[0]
        })
    } catch (err) {
        console.log(err)
    }
})


module.exports = readingListRouter;
