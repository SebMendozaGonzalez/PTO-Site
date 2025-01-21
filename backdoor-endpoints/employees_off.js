const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');
const dayjs = require('dayjs'); // Using dayjs for date manipulation

router.get('/employees-off', async (req, res) => {
    try {
        // Connect to the database
        const pool = await connectToDatabase();
        const connection = await pool.getConnection();

        // Get today's date
        const today = dayjs().startOf('day').toISOString();

        // Query the database for requests intersecting today's date
        const [rows] = await connection.execute(
            `
            SELECT * 
            FROM request
            WHERE 
                (start_date <= ? AND end_date >= ?)
            `,
            [today, today]
        );

        // Release the database connection
        connection.release();

        // Send the results back as JSON
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching employees off today:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
