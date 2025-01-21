const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');
const dayjs = require('dayjs');

// Route to fetch all requests intersecting with today's date
router.get('/', async (req, res) => {
    try {
        const pool = await connectToDatabase();

        // Get today's date
        const today = dayjs().startOf('day').toISOString();

        // Query the database for requests intersecting today's date
        const result = await pool.request()
            .input('today', today)
            .query(`
                SELECT * 
                FROM request
                WHERE 
                    start_date <= @today AND end_date >= @today
            `);

        if (result.recordset.length === 0) {
            console.log(`No requests found for today (${today}).`);
            return res.status(404).json({ message: 'No requests found for today' });
        }

        res.status(200).json(result.recordset); // Return the records
    } catch (err) {
        console.error(`Error fetching employees off today:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
