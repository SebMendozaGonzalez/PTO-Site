const sql = require('mssql');
require('dotenv').config(); // Load environment variables from .env file

// Database config loaded from .env
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // For Azure
  }
};

// Function to connect to the database
const connectToDb = async () => {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};

module.exports = {
  connectToDb,
  sql
};
