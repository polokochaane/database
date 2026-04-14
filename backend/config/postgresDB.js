const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'poloko#8',
    database: process.env.PG_DATABASE || 'water',
    port: Number(process.env.PG_PORT || 5432),
    ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
});

module.exports = pool;