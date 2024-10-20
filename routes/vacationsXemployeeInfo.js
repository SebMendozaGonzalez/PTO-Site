const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Function to fetch employees
async function getEmployees(req, res) {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request().query('SELECT * FROM Employees');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send('Error fetching employees: ' + error);
    }
}

// Define the route
router.get('/', getEmployees); // This route will respond to GET requests at '/vacationsXemployee-info'

// Export the router
module.exports = router;
