const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle vacation requests
router.post('/', async (req, res) => {
    console.log('Decide request route hit');
    const pool = await connectToDatabase();
    const { request_id, accepted, rejection_reason } = req.body;

    // Log the incoming data
    console.log('Incoming request body:', req.body);
    console.log('Deciding: ', {
        accepted,
        request_id,
        rejection_reason
    });


    try {
        const request = pool.request();
        request.input('request_id', request_id); // Correctly parameterized
        request.input('accepted', accepted);
        if (!accepted) {
            request.input('rejection_reason', rejection_reason);
        }

        // Begin SQL transaction
        await pool.query('BEGIN TRANSACTION');

        // Update the vacation request
        if (accepted) {
            await request.query(
                'UPDATE request SET accepted = @accepted WHERE request_id = @request_id;'
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
            'SELECT * FROM request WHERE request_id = @request_id ORDER BY decision_date DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY'
        );

        // Send the updated row back in the response
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        await pool.query('ROLLBACK'); // Ensure rollback
        console.error('Error updating request:', err); // Log detailed error
        res.status(500).json({ message: 'Error updating request', error: err.message, stack: err.stack });
    }
});

module.exports = router;
