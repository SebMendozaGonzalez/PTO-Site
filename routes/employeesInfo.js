const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig'); // Ensure you are importing the connection function

// GET route for /leader-portal
router.get('/', async (req, res) => {
    try {
        const pool = await connectToDatabase(); // Ensure you get the connection pool
        const result = await pool.request().query('SELECT * FROM dbo.roster ORDER BY employee_id DESC');
        res.json(result.recordset); // Use 'recordset' to get the result rows in mssql
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
