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

        request.input('employee_id', employee_id);

        // Check if employee_id exists in both tables
        const checkRosterQuery = `
            SELECT COUNT(*) AS count FROM roster WHERE employee_id = @employee_id;
        `;
        const checkVacationsQuery = `
            SELECT COUNT(*) AS count FROM vacations WHERE employee_id = @employee_id;
        `;

        const rosterResult = await request.query(checkRosterQuery);
        const vacationsResult = await request.query(checkVacationsQuery);

        const inRoster = rosterResult.recordset[0].count > 0;
        const inVacations = vacationsResult.recordset[0].count > 0;

        if (inRoster && inVacations) {
            return res.status(400).json({ message: 'The employee exists in both tables.' });
        }

        if (!inRoster) {
            // Insert into roster if not already there
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

            if (position !== undefined) request.input('position', position);

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

            if (position !== undefined) {
                columns.push('position');
                values.push('@position');
            }

            const insertRosterQuery = `
                INSERT INTO roster (${columns.join(', ')})
                VALUES (${values.join(', ')});
            `;

            await request.query(insertRosterQuery);
        }

        if (!inVacations) {
            // Insert into vacations if not already there
            request.input('position', position || null); // Use null if position is undefined
            request.input('start_date', start_date);
            request.input('leader_email', leader_email);
            request.input('leader_id', leader_id);

            const insertVacationQuery = `
                INSERT INTO vacations (
                    employee_id, full_name, position, start_date, end_date,
                    total_days, accued_days, [2020], [2021], [2022], [2023], [2024],
                    total, used_days, compensated_days, remaining_days, leader_email, leader_id
                )
                VALUES (
                    @employee_id, @full_name, @position, @start_date, CURRENT_TIMESTAMP,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, @leader_email, @leader_id
                );
            `;

            await request.query(insertVacationQuery);
        }

        // If both inserts succeed
        res.status(201).json({ message: 'Employee data added or updated successfully.' });

    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ message: 'Error adding employee', error: err.message });
    }
});

module.exports = router;
