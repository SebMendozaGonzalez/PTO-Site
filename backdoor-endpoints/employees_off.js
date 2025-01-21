const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');
const dayjs = require('dayjs');

// Route to fetch all requests intersecting with a specific date
router.get('/', async (req, res) => {
    const { date } = req.query; // Extract date from query parameters

    try {
        const pool = await connectToDatabase();

        // Validate and parse the date
        const selectedDate = date 
            ? dayjs(date).startOf('day').toISOString() 
            : dayjs().startOf('day').toISOString(); // Default to today if no date is provided

        if (!dayjs(selectedDate).isValid()) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Query the database for requests intersecting with the specified date
        const result = await pool.request()
            .input('selectedDate', selectedDate)
            .query(`
                SELECT * 
                FROM request
                WHERE 
                    start_date <= @selectedDate AND end_date >= @selectedDate
            `);

        if (result.recordset.length === 0) {
            console.log(`No requests found for date: ${selectedDate}.`);
            return res.status(404).json({ message: `No requests found for date: ${selectedDate}` });
        }

        res.status(200).json(result.recordset); // Return the records
    } catch (err) {
        console.error(`Error fetching employees off for date ${date || 'today'}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
