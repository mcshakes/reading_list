const { text } = require("body-parser");
const db = require("./index");

const createTableList = async function (tableName) {
    // const pool = new Pool(getConnection)

    // const client = await db.connect()

    return await db.query(
        `DROP TABLE IF EXISTS ${tableName} cascade;
            CREATE TABLE ${tableName} (
                id int generated always as identity PRIMARY KEY, 
                name VARCHAR(50) not null,
                list_type VARCHAR(50) not null
                );
        `
        )
    
    await db.release()
}


const createTableBooks = async function (tableName, listName) {

    return await db.query(
        `DROP TABLE IF EXISTS ${tableName};

            CREATE TABLE ${tableName} (
                id int generated always as identity PRIMARY KEY, 
                title TEXT not null,
                author TEXT not null,
                created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                completed boolean DEFAULT FALSE,
                reading_list_id INTEGER REFERENCES ${listName} (id) on DELETE CASCADE
            );
        `
    )

    await db.release()
}
// INSERT INTO test_list (name, list_type) values ('test', 'test_theme') returning *;
// INSERT INTO test_books (title, author, reading_list_id) VALUES ('poop', 'poop mcgoop', 1);

//  -------------------------- INSERT INTO TABLES --------------------------

const insertReadingList = async function (tableName, name, list_type) {
    return await db.query(`INSERT INTO ${tableName} (name, list_type) values ($1, $2) returning *`,
            [name, list_type]);

}

const insertBookInReadingList = async function (tableName, title, author, reading_list_id) {
    await db.query(`INSERT INTO ${tableName} (title, author, reading_list_id) VALUES ($1, $2, $3);`, 
                        [title, author, reading_list_id]);

}

const selectReadingList = async function (tableName, limit = 'ALL', columns = '*') {
    return await db.query(`SELECT ${columns} FROM ${tableName} LIMIT ${limit}`)

    await db.release()
}


const dropTable = async function (tableName) {
    return await db.query(`DROP TABLE IF EXISTS ${tableName} cascade;`)
}

module.exports = {
    createTableList,
    insertReadingList,
    selectReadingList,
    createTableBooks,
    insertBookInReadingList,
    dropTable
}

// THE FOLLOWING BELOW MAKES USERS AND LISTS WORK

// CREATE TABLE users (
//     id INT GENERATED ALWAYS AS IDENTITY,
//     username text,
//     email varchar() not null,
//     token text,
//     password_digest text,
//     created_at timestamp
//     );

// CREATE TABLE shelves (
//     id int generated always as identity PRIMARY KEY, 
//     name VARCHAR(50) not null,
//     list_type VARCHAR(50) not null,
//     user_id INTEGER REFERENCES user (id) on DELETE CASCADE
//     );

// ALTER TABLE users
// ADD CONSTRAINT user_id UNIQUE (id);

// ALTER TABLE reading_lists
// ADD COLUMN user_id int,
// ADD CONSTRAINT reading_lists_user_id_fkey
// FOREIGN KEY (user_id)
// REFERENCES users(id)
// ON DELETE CASCADE;

// CREATE TABLE test_list (
//     id int generated always as identity PRIMARY KEY, 
//     name VARCHAR(50) not null,
//     list_type VARCHAR(50) not null
//     );

// CREATE TABLE test_books (
//     id int generated always as identity PRIMARY KEY, 
//     title TEXT not null,
//     author TEXT not null,
//     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
//     completed boolean DEFAULT FALSE,
//     reading_list_id INTEGER REFERENCES test_list (id) on DELETE CASCADE
// );