const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle "removing" an employee by deactivating the record
router.patch('/:employee_id', async (req, res) => {
    console.log('Deactivate employee route hit');
    const { employee_id } = req.params;
    const { termination_reason, termination_date } = req.body;

    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        // Parameterize inputs to prevent SQL injection
        request.input('employee_id', employee_id);
        request.input('termination_reason', termination_reason);

        // Use the provided termination date or default to the current timestamp
        const terminationDate = termination_date ? new Date(termination_date) : new Date();
        request.input('termination_date', terminationDate);

        // Update query to set active to 0, termination reason, and termination date in the roster table
        const deactivateEmployeeQuery = `
            UPDATE roster
            SET 
                active = 0,
                termination_reason = @termination_reason,
                termination_date = @termination_date
            WHERE employee_id = @employee_id;
        `;

        // Execute the employee deactivation query
        const employeeUpdateResult = await request.query(deactivateEmployeeQuery);

        // Check if any row was affected (i.e., an employee was modified)
        if (employeeUpdateResult.rowsAffected[0] === 0) {
            console.log(`No employee found with ID: ${employee_id}`);
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update query to set active to 0 in the vacations table for the same employee
        const deactivateVacationsQuery = `
            UPDATE vacations
            SET active = 0
            WHERE employee_id = @employee_id;
        `;

        // Execute the vacation deactivation query
        const vacationUpdateResult = await request.query(deactivateVacationsQuery);

        console.log(`Deactivated vacations for employee ID: ${employee_id}, Rows affected: ${vacationUpdateResult.rowsAffected[0]}`);

        res.status(200).json({ 
            message: 'Employee and related vacations deactivated successfully', 
            employee_id 
        });

    } catch (err) {
        console.error('Error deactivating employee:', err);
        res.status(500).json({ message: 'Error deactivating employee', error: err.message });
    }
});

module.exports = router;