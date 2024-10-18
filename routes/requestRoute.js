const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle vacation requests
router.post('/', async (req, res) => {
    console.log('Received a request to submit a vacation request.');
    const pool = await connectToDatabase();
    const { type, start_date, end_date, explanation, employee_id, is_exception } = req.body;


    console.log('Inserting request with the following data:', {
        type,
        start_date,
        end_date,
        explanation,
        employee_id,
        is_exception
    });

    try {
        await pool.query(
            `INSERT INTO request (type, start_date, end_date, request_date, explanation, employee_id, is_exception)
             VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6)`,
            [type, start_date, end_date, explanation, employee_id, is_exception]
        );
        

        const result = await pool.query(
            `SELECT * FROM request WHERE employee_id = $1 ORDER BY request_date DESC LIMIT 1`,
            [employee_id]
        );
        

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error submitting request:', err.message);
        res.status(500).json({ message: 'Error submitting request', error: err.message || 'Internal Server Error' });
    }
});

module.exports = router;
