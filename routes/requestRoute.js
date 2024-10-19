const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');  // Your SQL connection pool

// Route to handle vacation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { type, start_date, end_date, explanation, employee_id, is_exception } = req.body;

    // Log the incoming data
    console.log('Inserting request with the following data:', {
        type,
        start_date,
        end_date,
        explanation,
        employee_id,
        is_exception
    });

    try {
        // Insert the new vacation request
        await pool.query(
            `INSERT INTO request (type, start_date, end_date, request_date, explanation, employee_id, is_exception)
             VALUES (@type, @start_date, @end_date, CURRENT_DATE, @explanation, @employee_id, @is_exception)`,
            {
                type: type,
                start_date: start_date,
                end_date: end_date,
                explanation: explanation,
                employee_id: employee_id,
                is_exception: is_exception
            }
        );
        
        // Retrieve the last inserted row for that employee
        const result = await pool.query(
            `SELECT * FROM request WHERE employee_id = @employee_id ORDER BY request_date DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY`,
            {
                employee_id: employee_id
            }
        );
        
        // Send the inserted row back in the response
        res.status(201).json(result.recordset[0]); // Adjusted for SQL Server
    } catch (err) {
        console.error('Error submitting request:', err);
        res.status(500).json({ message: 'Error submitting request', error: err.message });
    }
});

module.exports = router;
