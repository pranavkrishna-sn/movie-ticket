// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,       // e.g., 'localhost'
  port: process.env.DB_PORT,       // e.g., 5432
  user: process.env.DB_USER,       // your DB username
  password: process.env.DB_PASSWORD, // your DB password
  database: process.env.DB_NAME,   // your database name
});

pool.connect()
  .then(() => console.log(' Connected to PostgreSQL database'))
  .catch((err) => console.error(' Database connection error:', err));

module.exports = pool;
