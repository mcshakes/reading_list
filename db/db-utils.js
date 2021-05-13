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

const createTable = async function (tableName) {
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
    return res
}

// CREATE TABLE books (
// id SERIAL PRIMARY KEY,
// title TEXT,
// author TEXT,
// created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
// completed boolean DEFAULT FALSE
// reading_list_id INTEGER REFERENCES reading_lists (id) on DELETE CASCADE);

const dropTable = async function (tableName) {
    // const client = new Pool(getConnection())

    // const client = await db.connect()

    await db.query(`DROP TABLE IF EXISTS ${tableName}`)
    await db.end().then(() => console.log("Test Pool has ended"))
}

module.exports = {
    createTable,
    dropTable
}