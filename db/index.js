const { Pool } = require("pg")


const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: 5432,
    password: null
})

pool.on('connect', () => {
    console.log(`Connected to the DB: ${process.env.NODE_ENV}`);
});

module.exports = {
    query: (text, params) => pool.query(text, params)
}