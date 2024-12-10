const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig'); // Your SQL connection pool

// Route to handle liquidation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { 
        employe_id, 
        name, 
        leader_email, 
        days, 
        department, 
        explanation 
    } = req.body;

    // Log the incoming data
    console.log('Inserting liquidation request with the following data:', {
        employe_id,
        name,
        leader_email,
        days,
        department,
        explanation
    });

    try {
        // Start a new request
        const request = pool.request();

        // Add parameters for the SQL query
        request.input('employe_id', employe_id);
        request.input('name', name);
        request.input('leader_email', leader_email);
        request.input('days', days);
        request.input('department', department);
        request.input('explanation', explanation);

        // Insert the new liquidation request
        await request.query(
            `INSERT INTO liquidation_request (
                employe_id, 
                name, 
                leader_email, 
                days, 
                department, 
                explanation, 
                request_date
             )
             VALUES (
                @employe_id, 
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
             WHERE employe_id = @employe_id 
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
