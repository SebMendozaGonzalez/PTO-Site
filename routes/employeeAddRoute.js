// employeeAddRoute.js
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle creating a new employee
router.post('/', async (req, res) => {
    console.log('Add employee route hit');
    const {
        employee_id,
        name,
        full_name,
        date_of_birth,
        position, // Optional
        leader,
        leader_email,
        company,
        email_surgical,
        email_quantum,
        home_address,
        phone_number,
        emergency_contact,
        emergency_name,
        emergency_phone,
        department,
        start_date,
        leader_id
    } = req.body;

    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        // Mandatory inputs
        request.input('employee_id', employee_id);
        request.input('name', name);
        request.input('full_name', full_name);
        request.input('date_of_birth', date_of_birth);
        request.input('leader', leader);
        request.input('leader_email', leader_email);
        request.input('company', company);
        request.input('email_surgical', email_surgical);
        request.input('email_quantum', email_quantum);
        request.input('home_address', home_address);
        request.input('phone_number', phone_number);
        request.input('emergency_contact', emergency_contact);
        request.input('emergency_name', emergency_name);
        request.input('emergency_phone', emergency_phone);
        request.input('department', department);
        request.input('start_date', start_date);
        request.input('leader_id', leader_id);

        // Optional inputs (only bind if provided)
        if (position !== undefined) request.input('position', position);

        // Build dynamic insert query to handle optional fields
        const columns = [
            'employee_id', 'name', 'full_name', 'date_of_birth', 'leader',
            'leader_email', 'company', 'email_surgical', 'email_quantum',
            'home_address', 'phone_number', 'emergency_contact', 'emergency_name',
            'emergency_phone', 'department', 'start_date', 'leader_id'
        ];
        const values = [
            '@employee_id', '@name', '@full_name', '@date_of_birth', '@leader',
            '@leader_email', '@company', '@email_surgical', '@email_quantum',
            '@home_address', '@phone_number', '@emergency_contact', '@emergency_name',
            '@emergency_phone', '@department', '@start_date', '@leader_id'
        ];

        // Include `position` only if it is provided
        if (position !== undefined) {
            columns.push('position');
            values.push('@position');
        }

        const insertQuery = `
            INSERT INTO roster (${columns.join(', ')})
            VALUES (${values.join(', ')});
        `;

        // Execute the insert query
        await request.query(insertQuery);

        // Retrieve and return the newly added employee record
        const result = await request.query(`
            SELECT * 
            FROM roster 
            WHERE employee_id = @employee_id;
        `);

        if (result.recordset.length === 0) {
            console.log(`No record found after insertion for employee ID: ${employee_id}`);
            return res.status(404).json({ message: 'No employee found after insertion' });
        }

        res.status(201).json(result.recordset[0]);

    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ message: 'Error adding employee', error: err.message });
    }
});

module.exports = router;
