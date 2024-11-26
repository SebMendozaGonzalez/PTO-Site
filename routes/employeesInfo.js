const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to fetch all roster data
router.get('/', async (req, res) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request().query('SELECT * FROM dbo.roster ORDER BY name ASC');
        res.json(result.recordset); // Return all records
    } catch (err) {
        console.error('Error fetching roster data:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Route to fetch roster data for a specific employee_id
router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;

    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('employee_id', employee_id)
            .query(`
                SELECT * 
                FROM dbo.roster 
                WHERE employee_id = @employee_id
                ORDER BY name ASC
            `);

        if (result.recordset.length === 0) {
            console.log(`No roster data found for employee ID: ${employee_id}`);
            return res.status(404).json({ message: 'No roster data found for this employee' });
        }

        res.json(result.recordset); // Return matching records
    } catch (err) {
        console.error(`Error fetching roster data for employee ID ${employee_id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
