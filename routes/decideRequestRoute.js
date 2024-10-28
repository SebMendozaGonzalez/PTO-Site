// decideRequestRoute.js
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle decision on vacation requests
router.post('/', async (req, res) => {
    console.log('Decide request route hit');
    const { request_id, accepted, rejection_reason } = req.body;

    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        // Parameterize inputs to prevent SQL injection
        request.input('request_id', request_id);
        request.input('accepted', accepted === 'true'); // Convert to boolean as per your setup

        let updateQuery = `
            UPDATE request 
            SET decided = 1, 
            accepted = @accepted, 
            decision_date = CURRENT_TIMESTAMP
        `;

        // Append rejection_reason if the request is being rejected
        if (accepted === 'false') {
            request.input('rejection_reason', rejection_reason);
            updateQuery += `, rejection_reason = @rejection_reason`;
        }

        // Complete the query with the WHERE clause
        updateQuery += ` WHERE request_id = @request_id;`;

        // Execute the update query
        await request.query(updateQuery);

        // Retrieve and return the updated record
        const result = await request.query(`
            SELECT * 
            FROM request 
            WHERE request_id = @request_id 
            ORDER BY decision_date DESC 
            OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
        `);

        if (result.recordset.length === 0) {
            console.log(`No record found after update for request ID: ${request_id}`);
            return res.status(404).json({ message: 'No updated request found' });
        }

        res.status(200).json(result.recordset[0]);
        
    } catch (err) {
        console.error('Error updating request:', err);
        res.status(500).json({ message: 'Error updating request', error: err.message });
    }
});

module.exports = router;

