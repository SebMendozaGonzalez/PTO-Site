const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to get team data from employee_id
router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('employee_id', employee_id)
            .query(`
                SELECT col_team, us_team
                FROM roster
                WHERE employee_id = @employee_id;
            `);

        if (result.recordset.length === 0) {
            console.log(`No team data found for email: ${employee_id}`);
            return res.status(404).json({ message: 'No team data found with this employee_id' });
        }

        res.json(result.recordset[0]); // Return the first matching record
    } catch (err) {
        console.error(`Error fetching team data for employee_id ${employee_id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Export the router
module.exports = router;
