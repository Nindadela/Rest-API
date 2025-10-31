const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // DATABASE_URL Railway
  ssl: { rejectUnauthorized: false }          // penting di Railway
});

module.exports = pool;
