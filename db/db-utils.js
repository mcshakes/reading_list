const db = require("./index");
// const { Pool } = require('pg')

// const getConnection = () => {
//     return {
//         user: process.env.PGUSER,
//         host: process.env.PGHOST,
//         database: process.env.PGDATABASE,
//         port: 5432,
//         password: null
//     }
// }

const createTableList = async function (tableName) {
    // const pool = new Pool(getConnection)

    // const client = await db.connect()

    return await db.query(
        `DROP TABLE IF EXISTS ${tableName};
            CREATE TABLE ${tableName} (
                id SERIAL PRIMARY KEY, 
                name VARCHAR(50) not null,
                list_type VARCHAR(50) not null
                );
        `
        )
    
    await db.release()
}

const createTableBooks = async function (tableName) {

    return await db.query(
        `DROP TABLE IF EXISTS ${tableName};

            CREATE TABLE ${tableName} (
                id SERIAL PRIMARY KEY, 
                name TEXT not null,
                author TEXT not null,
                created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
                completed boolean DEFAULT FALSE,
                reading_list_id INTEGER REFERENCES reading_lists (id) on DELETE CASCADE
            );
        `
    )

    await db.release()
}

//  -------------------------- INSERT INTO TABLES --------------------------

const insertReadingList = async function (tableName, name, list_type) {
    return await db.query(`INSERT INTO ${tableName} (name, list_type) values ($1, $2) returning *`,
            [name, list_type]);

}

const insertBookInReadingList = async function (tableName, title, author, reading_list_id) {
    await db.query(`INSERT INTO ${tableName} (title, author, reading_list_id) VALUES ($1, $2, $3);`, 
                        [title, author, reading_list_id]);

    await db.release()
}

const selectReadingList = async function (tableName, limit = 'ALL', columns = '*') {
    return await db.query(`SELECT ${columns} FROM ${tableName} LIMIT ${limit}`)

    await db.release()
}


const dropTable = async function (tableName) {
    return await db.query(`DROP TABLE IF EXISTS ${tableName}`)
}

module.exports = {
    createTableList,
    insertReadingList,
    selectReadingList,
    createTableBooks,
    insertBookInReadingList,
    dropTable
}

