// routes/liquidationRequestsInfo.js
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to fetch all liquidation requests
router.get('/', async (req, res) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.query('SELECT * FROM liquidation_request ORDER BY employee_id DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching all liquidation requests:', err);
        res.status(500).send('Server error');
    }
});

// Route to fetch liquidation requests for a specific employee
router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;

    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('employee_id', employee_id)
            .query(`
                SELECT * 
                FROM liquidation_request 
                WHERE employee_id = 1
            `);

        if (result.recordset.length === 0) {
            console.log(`No liquidation request data found for employee ID: ${employee_id}`);
            return res.status(404).json({ message: 'No liquidation request data found for this employee' });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error(`Error fetching liquidation request data for employee ID ${employee_id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;