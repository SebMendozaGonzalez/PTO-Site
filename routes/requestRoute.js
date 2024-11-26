const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig'); // Your SQL connection pool

// Route to handle vacation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { 
        type, 
        start_date, 
        end_date, 
        explanation, 
        employee_id, 
        is_exception, 
        name, 
        leader_email, 
        department 
    } = req.body;

    // Log the incoming data
    console.log('Inserting request with the following data:', {
        type,
        start_date,
        end_date,
        explanation,
        employee_id,
        is_exception,
        name,
        leader_email,
        department
    });

    try {
        // Start a new request
        const request = pool.request();

        // Add parameters for the SQL query
        request.input('type', type);
        request.input('start_date', start_date);
        request.input('end_date', end_date);
        request.input('explanation', explanation);
        request.input('employee_id', employee_id);
        request.input('is_exception', is_exception);
        request.input('name', name);
        request.input('leader_email', leader_email);
        request.input('department', department);

        // Insert the new vacation request with additional columns
        await request.query(
            `INSERT INTO request (type, start_date, end_date, request_date, explanation, employee_id, is_exception, name, leader_email, department)
             VALUES (@type, @start_date, @end_date, CURRENT_TIMESTAMP, @explanation, @employee_id, @is_exception, @name, @leader_email, @department)`
        );

        // Retrieve the last inserted row for that employee
        const result = await request.query(
            `SELECT * FROM request 
             WHERE employee_id = @employee_id 
             ORDER BY request_date DESC 
             OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY`
        );

        // Send the inserted row back in the response
        res.status(201).json(result.recordset[0]); // Adjusted for SQL Server
    } catch (err) {
        console.error('Error submitting request:', err);
        res.status(500).json({ message: 'Error submitting request', error: err.message });
    }
});

module.exports = router;
