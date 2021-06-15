const express = require("express");
const readingListRouter = express.Router({ mergeParams: true });
const { verify } = require("../middleware/authenticate");
const db = require("../db/index");
const { insertReadingList } = require("../db/db-utils");

// Gets ALL watchlists regardless of  AUTH:
readingListRouter.get("/lists", async (req, res) => {

    try {
        const results = await db.query("SELECT * FROM reading_lists");

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

// ------------------------------------------------------------------------

// @desc Create a List as Authenticated User
// @route POST 
readingListRouter.post("/users/:id/lists", verify, async (req, res) => {
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


// @desc See a User's list without authentication
// @route GET /users/:id/lists
readingListRouter.get("/users/:id/lists", async (req, res) => {
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


// @desc Create a List as Authenticated User
// @route GET 
readingListRouter.post("/api/v1/lists", async (req, res) => {
    const body = req.body;

    if (body === undefined) {
        return res.status(400).json({ error: "content missing"})
    }

    try {
        // const results = await db.query("INSERT INTO reading_lists (name, list_type) values ($1, $2) returning *", 
        //                     [req.body.name, req.body.list_type]);
        const result = await insertReadingList("reading_lists", req.body.name, req.body.list_type)

        res.status(201).json({
            status: "success",
            data: result.rows[0]
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

readingListRouter.put("/api/v1/lists/:id", async (req, res) => {

    try {
        const results = await db.query("UPDATE reading_lists SET name = $1, list_type = $2 where id = $3 returning *", [req.body.name, req.body.list_type, req.params.id]);

        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: results.rows[0]
        })
    } catch (err) {
        console.log(err)
    }
})

readingListRouter.delete("/api/v1/lists/:id", async (req, res) => {

    try {
        const results = await db.query("DELETE FROM reading_lists WHERE id = $1", [req.params.id]);

        res.status(204).json({
            status: "success"
        })
    } catch (err) {
        console.log(err)
    }
})



module.exports = readingListRouter;
