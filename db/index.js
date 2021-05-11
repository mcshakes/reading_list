const { Pool } = require("pg")

const pool = new Pool()

pool.on('connect', () => {
    console.log('Connected to the DB');
});

module.exports = {
    query: (text, params) => pool.query(text, params)
}