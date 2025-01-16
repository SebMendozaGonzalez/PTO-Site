const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to get employee_id from email
router.get('/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('email', email)
            .query(`
                SELECT employee_id 
                FROM roster
                WHERE email_surgical = @email
            `);

        if (result.recordset.length === 0) {
            console.log(`No employee found for email: ${email}`);
            return res.status(404).json({ message: 'No employee found with this email' });
        }

        res.json(result.recordset[0]); // Return the first matching record
    } catch (err) {
        console.error(`Error fetching employee ID for email ${email}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Export the router
module.exports = router;