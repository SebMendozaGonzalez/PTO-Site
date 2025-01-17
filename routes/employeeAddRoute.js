const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Helper to bind inputs dynamically
const bindInputs = (request, inputs) => {
    for (const [key, value] of Object.entries(inputs)) {
        request.input(key, value !== "" ? value : null); // Use `null` for empty strings
    }
};

// Helper to construct an INSERT query dynamically
const constructInsertQuery = (table, data) => {
    const columns = Object.keys(data);
    const values = columns.map(col => `@${col}`);
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
};

router.post('/', async (req, res) => {
    console.log('Add employee route hit');

    const {
        employee_id,
        name,
        full_name = null,
        date_of_birth = null,
        position = null,
        leader_email,
        company = null,
        email_surgical,
        email_quantum = null,
        home_address = null,
        phone_number = null,
        emergency_contact = null,
        emergency_name = null,
        emergency_phone = null,
        department = null,
        start_date
    } = req.body;

    // Validate required fields
    const mandatoryFields = { employee_id, name, leader_email, email_surgical, start_date };
    const missingFields = Object.entries(mandatoryFields).filter(([_, value]) => !value);
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing mandatory fields: ${missingFields.map(([key]) => key).join(', ')}`
        });
    }

    try {
        const pool = await connectToDatabase();

        // Check existence in both tables using separate request objects
        const rosterRequest = pool.request();
        rosterRequest.input('employee_id', employee_id);

        const vacationsRequest = pool.request();
        vacationsRequest.input('employee_id', employee_id);

        const queries = {
            roster: 'SELECT COUNT(*) AS count FROM roster WHERE employee_id = @employee_id;',
            vacations: 'SELECT COUNT(*) AS count FROM vacations WHERE employee_id = @employee_id;'
        };

        const [rosterResult, vacationsResult] = await Promise.all([
            rosterRequest.query(queries.roster),
            vacationsRequest.query(queries.vacations)
        ]);

        const inRoster = rosterResult.recordset[0].count > 0;
        const inVacations = vacationsResult.recordset[0].count > 0;

        if (inRoster && inVacations) {
            return res.status(400).json({ message: 'The employee exists in both tables.' });
        }

        // Prepare data for insertion
        const rosterData = {
            employee_id,
            name,
            full_name,
            date_of_birth,
            position,
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
            start_date
        };

        const vacationsData = {
            employee_id,
            full_name: full_name || '',
            position: position || null,
            start_date,
            end_date: new Date().toISOString(), // Default to current timestamp
            total_days: 0,
            accued_days: 0,
            used_days: 0,
            compensated_days: 0,
            remaining_days: 0,
            leader_email
        };

        // Insert into roster if needed
        if (!inRoster) {
            const rosterInsertQuery = constructInsertQuery('roster', rosterData);
            const rosterRequest = pool.request(); // Create new request instance for roster insert
            bindInputs(rosterRequest, rosterData);
            await rosterRequest.query(rosterInsertQuery);
        }

        // Insert into vacations if needed
        if (!inVacations) {
            const vacationsInsertQuery = constructInsertQuery('vacations', vacationsData);
            const vacationsRequest = pool.request(); // Create new request instance for vacations insert
            bindInputs(vacationsRequest, vacationsData);
            await vacationsRequest.query(vacationsInsertQuery);
        }

        res.status(201).json({ message: 'Employee data added or updated successfully.' });

    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ message: 'Error adding employee', error: err.message });
    }
});

module.exports = router;
