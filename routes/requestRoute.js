const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle vacation requests
router.post('/', async (req, res) => {
    const pool = await connectToDatabase();
    const { request_id, accepted, rejection_reason } = req.body;

    // Log the incoming data
    console.log('Deciding: ', {
        accepted,
        request_id,
        rejection_reason
    });

    // Validate input
    if (!request_id || typeof accepted !== 'boolean') {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        const request = pool.request();

        // Add parameters for the SQL query
        request.input('request_id', request_id);
        request.input('accepted', accepted);

        if (!accepted) {
            request.input('rejection_reason', rejection_reason);
        }

        // Begin SQL transaction
        await pool.query('BEGIN TRANSACTION');

        // Update the vacation request
        if (accepted) {
            await request.query(
                'UPDATE request SET accepted = @accepted, rejection_reason = NULL WHERE request_id = @request_id;'
            );
        } else {
            await request.query(
                'UPDATE request SET accepted = @accepted, rejection_reason = @rejection_reason WHERE request_id = @request_id;'
            );
        }

        // Commit the transaction
        await pool.query('COMMIT');

        // Retrieve the updated request
        const result = await request.query(
            `SELECT * FROM request WHERE request_id = @request_id ORDER BY decision_date DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY`
        );

        // Send the updated row back in the response
