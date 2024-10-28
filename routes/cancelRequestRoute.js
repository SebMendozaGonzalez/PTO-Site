// cancelRequestRoute.js
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle cancellation of a vacation request
router.post('/', async (req, res) => {
    console.log('Cancel request route hit');
    const { request_id } = req.body;

    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        // Parameterize the input
        request.input('request_id', request_id);

        // Update the cancelled column
        const updateQuery = `
            UPDATE request
            SET cancelled = 1
            WHERE request_id = @request_id;
        `;

        await request.query(updateQuery);

        // Confirm the update
        const result = await request.query(`
            SELECT * 
            FROM request 
            WHERE request_id = @request_id 
            ORDER BY decision_date DESC 
            OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
        `);

        if (result.recordset.length === 0) {
            console.log(`No record found for request ID: ${request_id}`);
            return res.status(404).json({ message: 'No request found to cancel' });
        }

        res.status(200).json(result.recordset[0]);

    } catch (err) {
        console.error('Error canceling request:', err);
        res.status(500).json({ message: 'Error canceling request', error: err.message });
    }
});

module.exports = router;
