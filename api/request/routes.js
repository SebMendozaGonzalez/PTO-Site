const express = require('express');
const router = express.Router();
const requestController = require('./controller');

// Route to fetch all requests
router.get('/', requestController.getAllRequests);

// Route to fetch requests for a specific employee
router.get('/:employee_id', requestController.getRequestsByEmployeeId);

// Route to handle creating a new vacation request
router.post('/', requestController.createRequest);

// Route to handle decision on vacation requests
router.patch('/', requestController.decideRequest);

// Route to handle cancellation of a vacation request
router.delete('/:employee_id', requestController.cancelRequest);

module.exports = router;
