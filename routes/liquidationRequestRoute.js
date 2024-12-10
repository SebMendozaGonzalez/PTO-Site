const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig'); // Your SQL connection pool

// Route to handle liquidation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { 
        employee_id, 
        name, 
        leader_email, 
        days, 
        department, 
        explanation 
    } = req.body;

    // Log the incoming data
    console.log('Inserting liquidation request with the following data:', {
        employee_id,
        name,
        leader_email,
        days,
        department,
        explanation
    });

    // Check for required fields
    if (!employee_id) {
        return res.status(400).json({
            message: 'Employee ID is required to submit a liquidation request.'
        });
    }

    try {
        // Start a new request
        const request = pool.request();

        // Add parameters for the SQL query
        request.input('employee_id', employee_id);
        request.input('name', name || null); // Optional field
        request.input('leader_email', leader_email || null); // Optional field
        request.input('days', days || 0); // Default to 0 if not provided
        request.input('department', department || null); // Optional field
        request.input('explanation', explanation || null); // Optional field

        // Insert the new liquidation request
        await request.query(
            `INSERT INTO liquidation_request (
                employee_id, 
                name, 
                leader_email, 
                days, 
                department, 
                explanation, 
                request_date
             )
             VALUES (
                @employee_id, 
                @name, 
                @leader_email, 
                @days, 
                @department, 
                @explanation, 
                CURRENT_TIMESTAMP
             )`
        );

        // Retrieve the last inserted row for that employee
        const result = await request.query(
            `SELECT * FROM liquidation_request 
             WHERE employee_id = @employee_id 
             ORDER BY request_date DESC 
             OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY`
        );

        // Send the inserted row back in the response
        res.status(201).json(result.recordset[0]); // Adjusted for SQL Server
    } catch (err) {
        console.error('Error submitting liquidation request:', err);
        res.status(500).json({ message: 'Error submitting liquidation request', error: err.message });
    }
});

module.exports = router;
