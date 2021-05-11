const { Pool } = require('pg')

const getConnection = () => {
    return {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        port: 5432,
        password: null
    }
}

const createTable = async function (tableName) => {
    const pool = new Pool(getConnection)

    await pool.connect()

    return await pool.query(
        `DROP TABLE IF EXISTS ${tableName};
            CREATE TABLE ${tableName} (
                id SERIAL PRIMARY KEY, 
                name VARCHAR(50) not null,
                list_type VARCHAR(50) not null,
                );
        `
        )
    
    await pool.end()
    return res
}