const { connectToDatabase } = require('../../db/dbConfig');

// Fetch all employees from the roster
const fetchAllEmployees = async () => {
    const pool = await connectToDatabase();
    const result = await pool.request().query('SELECT * FROM dbo.roster ORDER BY name ASC');
    return result.recordset;
};

// Fetch an employee by ID from the roster
const fetchEmployeeById = async (employee_id) => {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .input('employee_id', employee_id)
        .query(`
            SELECT * 
            FROM dbo.roster 
            WHERE employee_id = @employee_id
            ORDER BY name ASC
        `);
    return result.recordset;
};

// Helper for POST method to bind inputs dynamically
const bindInputs = (request, inputs) => {
    for (const [key, value] of Object.entries(inputs)) {
        request.input(key, value !== "" ? value : null); // Use `null` for empty strings
    }
};

// Helper for POST method to construct an INSERT query dynamically
const constructInsertQuery = (table, data) => {
    const columns = Object.keys(data);
    const values = columns.map(col => `@${col}`);
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
};

// Add a new employee to the database
const addEmployeeToDB = async (employeeData) => {
    const {
        employee_id, name, full_name, date_of_birth, position, leader_email, company, email_surgical, email_quantum, home_address, phone_number, emergency_contact, emergency_name, emergency_phone, department, start_date
    } = employeeData;

    const pool = await connectToDatabase();

    // Check existence in both tables
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

    // Prepare data for insertion
    const rosterData = {
        employee_id, name, full_name, date_of_birth, position, leader_email, company, email_surgical, email_quantum, home_address, phone_number, emergency_contact, emergency_name, emergency_phone, department, start_date
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
        const rosterInsertRequest = pool.request(); // New request for roster insert
        bindInputs(rosterInsertRequest, rosterData);
        await rosterInsertRequest.query(rosterInsertQuery);
    }

    // Insert into vacations if needed
    if (!inVacations) {
        const vacationsInsertQuery = constructInsertQuery('vacations', vacationsData);
        const vacationsInsertRequest = pool.request(); // New request for vacations insert
        bindInputs(vacationsInsertRequest, vacationsData);
        await vacationsInsertRequest.query(vacationsInsertQuery);
    }

    return { message: 'Employee data added or updated successfully.' };
};



// Update an employee in the database
const updateEmployeeInDB = async (employeeData) => {
    const {
        employee_id, name, full_name, date_of_birth, position, email_surgical, email_quantum, phone_number, home_address, company, department, start_date, leader, leader_email, leader_id, emergency_contact, emergency_name, emergency_phone
    } = employeeData;

    const pool = await connectToDatabase();
    const request = pool.request();

    // Bind input parameters
    const inputs = {
        employee_id, name, full_name, date_of_birth, position, email_surgical, email_quantum, phone_number, home_address, company, department, start_date, leader, leader_email, leader_id, emergency_contact, emergency_name, emergency_phone
    };

    for (const [key, value] of Object.entries(inputs)) {
        request.input(key, value ?? '');
    }

    // Update query
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

    // Execute update query
    await request.query(updateQuery);

    // Retrieve and return the updated employee record
    const result = await request.query(`
        SELECT * 
        FROM roster 
        WHERE employee_id = @employee_id;
    `);

    return result.recordset.length > 0 ? result.recordset[0] : null;
};



// Deactivate an employee and their related vacations
const deactivateEmployee = async (employee_id, termination_reason, termination_date) => {
    const pool = await connectToDatabase();
    const request = pool.request();

    // Use the provided termination date or default to the current timestamp
    const terminationDate = termination_date ? new Date(termination_date) : new Date();

    // Bind input parameters
    request.input('employee_id', employee_id);
    request.input('termination_reason', termination_reason || 'Not provided');
    request.input('termination_date', terminationDate);

    // Deactivate employee in the roster table
    const deactivateEmployeeQuery = `
        UPDATE roster
        SET 
            active = 0,
            termination_reason = @termination_reason,
            termination_date = @termination_date
        WHERE employee_id = @employee_id;
    `;

    const employeeUpdateResult = await request.query(deactivateEmployeeQuery);

    // If no rows were affected, the employee was not found
    if (employeeUpdateResult.rowsAffected[0] === 0) {
        return null;
    }

    // Deactivate related vacations in the vacations table
    const deactivateVacationsQuery = `
        UPDATE vacations
        SET active = 0
        WHERE employee_id = @employee_id;
    `;

    await request.query(deactivateVacationsQuery);

    return true;
};

module.exports = {
    fetchAllEmployees,
    fetchEmployeeById,
    addEmployeeToDB,
    updateEmployeeInDB,
    deactivateEmployee,
};