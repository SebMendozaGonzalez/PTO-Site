const express = require('express');
const router = express.Router();
const liquidationRequestController = require('./controller');

// Route to fetch all liquidation requests
router.get('/', liquidationRequestController.getAllLiquidationRequests);

// Route to fetch liquidation requests for a specific employee
router.get('/:employee_id', liquidationRequestController.getLiquidationRequestsByEmployee);

// Route to handle liquidation request creation
router.post('/', liquidationRequestController.createLiquidationRequest);

// Route to handle decision updates for liquidation requests
router.patch('/:request_id', liquidationRequestController.updateLiquidationRequestDecision);

// Route to handle the cancellation of a liquidation request
router.delete('/:request_id', liquidationRequestController.cancelLiquidationRequest);

module.exports = router;
