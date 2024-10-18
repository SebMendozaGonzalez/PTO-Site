const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');  // Your SQL connection pool

// Route to handle vacation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { type_of_to, start_date, end_date, explanation, employee_id, is_exception } = req.body;

    try {
        // Perform the INSERT operation without RETURNING
        await pool.query(
            `INSERT INTO request (type_of_to, start_date, end_date, request_date, explanation, employee_id, is_exception)
             VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6)`,
            [type_of_to, start_date, end_date, explanation, employee_id, is_exception]
        );
        
        // After insertion, retrieve the last inserted row based on some unique identifier (like request ID)
        const result = await pool.query(
            `SELECT TOP 1 * FROM request WHERE employee_id = $1 ORDER BY request_date DESC`,
            [employee_id]
        );
        
        res.status(201).json(result.rows[0]); // Send back the inserted row
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting request' });
    }
});

module.exports = router;
