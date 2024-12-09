// updateEmployeeRoute.js
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to handle updating employee information
router.post('/', async (req, res) => {
    console.log('Update employee route hit');
    console.log('Final payload:', JSON.stringify(req.body));

    const {
        employee_id, 
        name, 
        full_name, 
        date_of_birth, 
        position, 
        email_surgical, 
        email_quantum, 
        phone_number, 
        home_address, 
        company, 
        department, 
        start_date, 
        leader, 
        leader_email, 
        leader_id, 
        emergency_contact, 
        emergency_name, 
        emergency_phone
    } = req.body;

    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        console.log('Binding parameters:');
        console.log({
            employee_id: employee_id ?? '',
            name: name ?? '',
            full_name: full_name ?? '',
            date_of_birth: date_of_birth ?? '',
            position: position ?? '',
            email_surgical: email_surgical ?? '',
            email_quantum: email_quantum ?? '',
            phone_number: phone_number ?? '',
            home_address: home_address ?? '',
            company: company ?? '',
            department: department ?? '',
            start_date: start_date ?? '',
            leader: leader ?? '',
            leader_email: leader_email ?? '',
            leader_id: leader_id ?? '',
            emergency_contact: emergency_contact ?? '',
            emergency_name: emergency_name ?? '',
            emergency_phone: emergency_phone ?? ''
        });

        // Parameterize inputs to prevent SQL injection
        request.input('employee_id', employee_id ?? '');
        request.input('name', name ?? '');
        request.input('full_name', full_name ?? '');
        request.input('date_of_birth', date_of_birth ?? '');
        request.input('position', position ?? '');
        request.input('email_surgical', email_surgical ?? '');
        request.input('email_quantum', email_quantum ?? '');
        request.input('phone_number', phone_number ?? '');
        request.input('home_address', home_address ?? '');
        request.input('company', company ?? '');
        request.input('department', department ?? '');
        request.input('start_date', start_date ?? '');
        request.input('leader', leader ?? '');
        request.input('leader_email', leader_email ?? '');
        request.input('leader_id', leader_id ?? '');
        request.input('emergency_contact', emergency_contact ?? '');
        request.input('emergency_name', emergency_name ?? '');
        request.input('emergency_phone', emergency_phone ?? '');

        // Update query to modify the employee's information
        const updateQuery = `
            UPDATE roster
            SET 
                name = @name,
                full_name = @full_name,
                date_of_birth = @date_of_birth,
                position = @position,
                email_surgical = @email_surgical,
                email_quantum = @email_quantum,
                phone_number = @phone_number,
                home_address = @home_address,
                company = @company,
                department = @department,
                start_date = @start_date,
                leader = @leader,
                leader_email = @leader_email,
                leader_id = @leader_id,
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
