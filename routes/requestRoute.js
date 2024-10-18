const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');  // Your SQL connection pool

// Route to handle vacation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { type, start_date, end_date, explanation, employee_id, is_exception } = req.body;

    try {
        // Insert the new vacation request
        await pool.query(
            `INSERT INTO request (type, start_date, end_date, request_date, explanation, employee_id, is_exception)
             VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6)`,
            [type, start_date, end_date, explanation, employee_id, is_exception]
        );
        
        // Retrieve the last inserted row for that employee
        const result = await pool.query(
            `SELECT * FROM request WHERE employee_id = $1 ORDER BY request_date DESC LIMIT 1`,
            [employee_id]
        );
        
        // Send the inserted row back in the response
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error submitting request:', err);
        res.status(500).json({ message: 'Error submitting request' });
    }
});

module.exports = router;
