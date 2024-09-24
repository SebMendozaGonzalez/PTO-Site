const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Create a new pool using the connection string from the .env file
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Ensure DATABASE_URL is defined in your .env file
});

module.exports = pool; // Export the pool to be used in other parts of your application
