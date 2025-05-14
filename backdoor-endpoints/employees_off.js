const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');
const dayjs = require('dayjs');

// Route to fetch all requests intersecting with a specific date
router.get('/', async (req, res) => {
    const { date } = req.query; // Extract date from query parameters
    const us_team = req.query.us_team !== undefined ? parseInt(req.query.us_team) : 0;
    const col_team = req.query.col_team !== undefined ? parseInt(req.query.col_team) : 1;

    try {
        const pool = await connectToDatabase();

        // Validate and parse the date
        const selectedDate = date 
            ? dayjs(date).startOf('day').toISOString() 
            : dayjs().startOf('day').toISOString(); // Default to today if no date is provided

        if (!dayjs(selectedDate).isValid()) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Query requests intersecting with the specified date and filter by us_team
        const result = await pool.request()
            .input('selectedDate', selectedDate)
            .input('us_team', us_team)
            .input('col_team', col_team)
            .query(`
                    SELECT r.*
                    FROM request r
                    JOIN roster e ON r.employee_id = e.employee_id
                    WHERE 
                        r.start_date <= @selectedDate 
                        AND r.end_date >= @selectedDate
                        AND r.accepted = 1
                        AND r.cancelled = 0
                        AND ((@us_team = 1 AND @col_team = 1 ) OR (r.us_team = @us_team AND e.col_team = @col_team))
                `)


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
