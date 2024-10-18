const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');  // Your PostgreSQL Pool

// Valid short forms of time off types
const validTypes = ['PTO', 'ML', 'PL', 'DCL', 'BL', 'UTO'];

// Route to handle vacation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { type_of_to, start_date, end_date, explanation, employee_id, is_exception } = req.body;

    // Validate the type_of_to field
    if (!validTypes.includes(type_of_to)) {
        return res.status(400).json({ message: 'Invalid type of time off' });
    }

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
