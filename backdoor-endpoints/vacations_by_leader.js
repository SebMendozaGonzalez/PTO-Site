const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');


router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
        
            .input('employee_id', employee_id)
            .query(`
                SELECT * 
                FROM vacations 
                WHERE employee_id = @employee_id
            `);

        if (result.recordset.length === 0) {
            // Log if no records are found
            console.log(`No vacation data found for employee ID: ${employee_id}`);
            return res.status(404).json({ message: 'No vacation data found for this employee' });
        }

        res.json(result.recordset[0]); // Return the first matching record
    } catch (err) {
        // Log detailed error for debugging
        console.error(`Error fetching vacation data for employee ID ${employee_id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;