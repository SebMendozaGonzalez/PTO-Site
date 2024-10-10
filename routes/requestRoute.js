const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');  // Your PostgreSQL Pool

// Route to handle vacation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { type_of_to, start_date, end_date, explanation, employee_id, is_exception } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO request (type_of_to, start_date, end_date, request_date, explanation, employee_id, is_exception)
             VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6)
             RETURNING *`,
            [type_of_to, start_date, end_date, explanation, employee_id, is_exception]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting request' });
    }
});

module.exports = router;
