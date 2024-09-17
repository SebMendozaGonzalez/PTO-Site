const express = require('express');
const router = express.Router();
const { connectToDb } = require('../db/dbConfig'); // Ensure this returns the correct connection

// API route for getting employees
router.get('/employees', async (req, res) => {
    try {
        const pool = await connectToDb(); // Get connection pool from dbConfig
        const result = await pool.request().query('SELECT * FROM roster'); // Query the database
        res.json(result.recordset); // Send back the list of employees
    } catch (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Error retrieving employees');
    }
});

module.exports = router;
