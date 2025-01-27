const express = require('express');
const router = express.Router();
const employeeController = require('./controller');

// Route to fetch all employees
router.get('/', employeeController.getAllEmployees);

// Route to fetch an employee by ID
router.get('/:employee_id', employeeController.getEmployeeById);

// Route to add a new employee
router.post('/', employeeController.addEmployee);

// Route to update an employee
router.patch('/', employeeController.updateEmployee);

// Route to delete (deactivate) an employee
router.delete('/:employee_id', employeeController.deleteEmployee);

module.exports = router;
