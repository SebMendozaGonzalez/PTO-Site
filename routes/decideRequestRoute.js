const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle vacation requests
router.post('/', async (req, res) => {
    console.log('Decide request route hit');
    const pool = await connectToDatabase();
    const { request_id, accepted, rejection_reason } = req.body;

    console.log('Incoming request body:', req.body);
    console.log('Deciding: ', {
        accepted,
        request_id,
        rejection_reason
    });

    const transaction = new sql.Transaction(pool); // Create a transaction object

    try {
        // Begin the transaction
        await transaction.begin();

        const request = new sql.Request(transaction); // Use the transaction for this request
        request.input('request_id', request_id);
        request.input('accepted', Boolean(accepted)); // Cast to boolean
        
        if (!Boolean(accepted)) {
            request.input('rejection_reason', rejection_reason);
        }

        // Update the vacation request based on acceptance or rejection
        if (Boolean(accepted)) {
            await request.query(
                'UPDATE request SET accepted = @accepted, rejection_reason = NULL WHERE request_id = @request_id;'
            );
        } else {
            await request.query(
                'UPDATE request SET accepted = @accepted, rejection_reason = @rejection_reason WHERE request_id = @request_id;'
            );
        }

        // Commit the transaction if everything goes well
        await transaction.commit();

        // Retrieve the updated request
        const result = await request.query(
            'SELECT * FROM request WHERE request_id = @request_id ORDER BY decision_date DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY'
        );

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        // Rollback the transaction if any error occurs
        await transaction.rollback();
        console.error('Error updating request:', err);
        res.status(500).json({ message: 'Error updating request', error: err.message });
    }
});

module.exports = router;
