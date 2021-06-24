const express = require("express");
const booksRouter = express.Router({ mergeParams: true });
const { verify } = require("../middleware/authenticate");

const db = require("../db/index");

// *********************************************************************************
// @desc get all books from user's list WITHOUT authentication
// @route POST /users/:user_id/lists/:shelf_id/books
// *********************************************************************************

booksRouter.get("/users/:user_id/shelves/:shelf_id/books", async (req,res) => {
    const { shelf_id } = req.params
    try {
        const shelvedBooks = await db.query("SELECT * FROM books WHERE shelf_id=$1", [shelf_id]);

        // console.log("THESE BOOKS", shelvedBooks)

        // if (shelvedBooks.rowCount != 0) {
        //     shelvedBooks.rows[0].books = books.rows;
        // } 

        res.status(200).json({
            status: "success",
            results: shelvedBooks.rowCount,
            data: {
                books: shelvedBooks.rows
            }
        })
    } catch (err) {
        console.log(err)
    }
})

// *********************************************************************************
// @desc Add a book to user's list with AUTH
// @route POST /users/:user_id/lists/:shelf_id/books
// *********************************************************************************

booksRouter.post("/users/:user_id/shelves/:shelf_id/books", verify, async (req,res) => {

    if (req.body === undefined) {
        return res.status(400).json({ error: "content missing"})
    }

    const { user_id, shelf_id } = req.params;
    const { title, author } = req.body
    

    try {
        const list = await db.query("INSERT INTO books (title, author, shelf_id) VALUES ($1, $2, $3) returning *;", 
                        [title, author, shelf_id]);

        res.status(201).json({
            status: "success",
            data: list.rows[0]
        })
    } catch (err) {
        console.log(err)
    }
})

// *********************************************************************************
// @desc Remove a book FROM user's shelf with AUTH
// @route DELETE /users/:user_id/lists/:shelf_id/books/:id
// *********************************************************************************

booksRouter.delete("/users/:user_id/shelves/:shelf_id/books/:id", verify, async (req,res) => {

    const { user_id, shelf_id, id } = req.params;
    

    try {
        const results = await db.query("DELETE FROM books WHERE id = $1 AND shelf_id = $2", [id, shelf_id]);
        
        // DONT NEED TO HANDLE WHERE ITEM ALREADY DELETED, DEPENDANT on book_id

        res.status(200).json({
            status: "success"
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = booksRouter;