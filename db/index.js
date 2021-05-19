const { Pool } = require("pg")

const PG_DATABASE = process.env.NODE_ENV === "test" 
? process.env.TEST_DATABASE 
: process.env.DEV_DATABASE


const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: PG_DATABASE,
    port: 5432,
    password: null
})

pool.on('connect', () => {
    console.log(`Connected to the DB: ${process.env.NODE_ENV}`);
});

module.exports = {
    query: (text, params) => pool.query(text, params)
}