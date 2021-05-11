const express = require("express");
const booksRouter = express.Router({ mergeParams: true });

const db = require("../db/index");

booksRouter.get("/api/v1/lists/:id/books", async (req,res) => {
    try {
        const list = await db.query("SELECT * FROM reading_lists WHERE id = $1", [req.params.id]);

        const books = await db.query("SELECT * FROM books WHERE reading_list_id=$1", [req.params.id]);

        if (books.rowCount != 0) {
            list.rows[0].books = books.rows;
        } 

        res.status(200).json({
            status: "success",
            results: books.rows.length,
            data: {
                reading_lists: list.rows[0]
            }
        })
    } catch (err) {
        console.log(err)
    }
})

booksRouter.post("/api/v1/lists/:id/books", async (req,res) => {

    const body = req.body;

    if (body === undefined) {
        return res.status(400).json({ error: "content missing"})
    }

    try {
        const list = await db.query("INSERT INTO books (title, author, reading_list_id) VALUES ($1, $2, $3);", 
                        [body.title, body.author, req.params.id]);

        res.status(201).json({
            status: "success",
            // results: list,
            // data: {
            //     reading_lists: list
            // }
        })
    } catch (err) {
        console.log(err)
    }
})

booksRouter.delete("/api/v1/lists/:list_id/books/:book_id", async (req,res) => {

    try {
        const results = await db.query("DELETE FROM books WHERE id = $1", [req.params.book_id]);
        
        // NEED TO HANDLE WHERE ITEM ALREADY DELETED

        res.status(200).json({
            status: "success",
            // results: list,
            // data: {
            //     reading_lists: list
            // }
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = booksRouter;