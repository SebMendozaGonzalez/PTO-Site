const employeeService = require('./service');

// Fetch all employees
const getAllEmployees = async (req, res) => {
    try {
        const includeUsTeam = req.query.include_us_team === '1';
        const employees = await employeeService.fetchAllEmployees(includeUsTeam);
        res.status(200).json(employees);
    } catch (err) {
        console.error('Error fetching roster data:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Fetch an employee by ID
const getEmployeeById = async (req, res) => {
    const { employee_id } = req.params;
    try {
        const employee = await employeeService.fetchEmployeeById(employee_id);
        if (!employee || employee.length === 0) {
            console.log(`No roster data found for employee ID: ${employee_id}`);
            return res.status(404).json({ message: 'No roster data found for this employee' });
        }
        res.status(200).json(employee);
    } catch (err) {
        console.error(`Error fetching roster data for employee ID ${employee_id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add a new employee
const addEmployee = async (req, res) => {
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
        const result = await employeeService.addEmployeeToDB({
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
        });

        res.status(201).json(result);
    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ message: 'Error adding employee', error: err.message });
    }
};

// Update an employee
const updateEmployee = async (req, res) => {
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

    if (!employee_id) {
        return res.status(400).json({ message: 'Employee ID is required for updating an employee.' });
    }

    try {
        const updatedEmployee = await employeeService.updateEmployeeInDB({
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
        });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'No updated employee found.' });
        }

        res.status(200).json(updatedEmployee);
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Error updating employee', error: err.message });
    }
};

// Delete (deactivate) an employee
const deleteEmployee = async (req, res) => {
    console.log('Delete (deactivate) employee route hit');
    const { employee_id } = req.params;
    const { termination_reason, termination_date } = req.body;

    if (!employee_id) {
        return res.status(400).json({ message: 'Employee ID is required for deletion.' });
    }

    try {
        const result = await employeeService.deactivateEmployee(employee_id, termination_reason, termination_date);

        if (!result) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({ 
            message: 'Employee and related vacations deactivated successfully', 
            employee_id 
        });
    } catch (err) {
        console.error('Error deactivating employee:', err);
        res.status(500).json({ message: 'Error deactivating employee', error: err.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
};
