const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle "removing" an employee by deactivating the record
router.patch('/:employee_id', async (req, res) => {
    console.log('Deactivate employee route hit');
    const { employee_id } = req.params;
    const { termination_reason } = req.body;

    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        // Parameterize inputs to prevent SQL injection
        request.input('employee_id', employee_id);
        request.input('termination_reason', termination_reason);

        // Update query to set active to 0 and add termination reason
        const updateQuery = `
            UPDATE roster
            SET 
                active = 0,
                termination_reason = @termination_reason
            WHERE employee_id = @employee_id;
        `;

        // Execute the update query
        const updateResult = await request.query(updateQuery);

        // Check if any row was affected (i.e., an employee was modified)
        if (updateResult.rowsAffected[0] === 0) {
            console.log(`No employee found with ID: ${employee_id}`);
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deactivated successfully', employee_id });

    } catch (err) {
        console.error('Error deactivating employee:', err);
        res.status(500).json({ message: 'Error deactivating employee', error: err.message });
    }
});

module.exports = router;
