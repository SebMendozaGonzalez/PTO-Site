// updateEmployeeRoute.js
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle updating employee information
router.post('/', async (req, res) => {
    console.log('Update employee route hit');
    console.log('Final payload:', JSON.stringify(req.body));
    const { employee_id, name, email, phone_number, home_address, company, department, leader, emergency_contact, emergency_name, emergency_phone } = req.body;

    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        console.log('Binding parameters:');
        console.log({
            employee_id,
            name,
            email, // <-- Log this value to ensure it's being set correctly
            phone_number,
            home_address,
            company,
            department,
            leader,
            emergency_contact,
            emergency_name,
            emergency_phone
        });
        // Parameterize inputs to prevent SQL injection
        request.input('employee_id', employee_id);
        request.input('name', name);
        request.input('email', email);
        request.input('phone_number', phone_number);
        request.input('home_address', home_address);
        request.input('company', company);
        request.input('department', department);
        request.input('leader', leader);
        request.input('emergency_contact', emergency_contact);
        request.input('emergency_name', emergency_name);
        request.input('emergency_phone', emergency_phone);

        // Update query to modify the employee's information
        const updateQuery = `
            UPDATE roster
            SET 
                name = @name,
                email_surgical = @email,
                phone_number = @phone_number,
                home_address = @home_address,
                company = @company,
                department = @department,
                leader = @leader,
                emergency_contact = @emergency_contact,
                emergency_name = @emergency_name,
                emergency_phone = @emergency_phone
            WHERE employee_id = @employee_id;
        `;

        console.log('Executing query:', updateQuery);
        // Execute the update query
        await request.query(updateQuery);

        // Retrieve and return the updated employee record
        const result = await request.query(`
            SELECT * 
            FROM roster 
            WHERE employee_id = @employee_id;
        `);

        if (result.recordset.length === 0) {
            console.log(`No record found after update for employee ID: ${employee_id}`);
            return res.status(404).json({ message: 'No updated employee found' });
        }

        res.status(200).json(result.recordset[0]);

    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Error updating employee', error: err.message });
    }
});

module.exports = router;
