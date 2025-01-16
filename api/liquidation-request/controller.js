const liquidationRequestService = require('./service');

// Controller to handle fetching all liquidation requests
const getAllLiquidationRequests = async (req, res) => {
    try {
        const requests = await liquidationRequestService.fetchAllLiquidationRequests();
        res.json(requests);
    } catch (err) {
        console.error('Error fetching all liquidation requests:', err);
        res.status(500).send('Server error');
    }
};

// Controller to handle fetching liquidation requests for a specific employee
const getLiquidationRequestsByEmployee = async (req, res) => {
    const { employee_id } = req.params;

    try {
        const requests = await liquidationRequestService.fetchLiquidationRequestsByEmployee(employee_id);
        if (requests.length === 0) {
            console.log(`No liquidation request data found for employee ID: ${employee_id}`);
            return res.status(404).json({ message: 'No liquidation request data found for this employee' });
        }
        res.json(requests);
    } catch (err) {
        console.error(`Error fetching liquidation request data for employee ID ${employee_id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Controller to handle creating a new liquidation request
const createLiquidationRequest = async (req, res) => {
    const { employee_id, name, leader_email, days, department, explanation } = req.body;

    console.log('Inserting liquidation request with the following data:', {
        employee_id,
        name,
        leader_email,
        days,
        department,
        explanation
    });

    if (!employee_id) {
        return res.status(400).json({
            message: 'Employee ID is required to submit a liquidation request.'
        });
    }

    try {
        const insertedRequest = await liquidationRequestService.insertLiquidationRequest({
            employee_id,
            name,
            leader_email,
            days,
            department,
            explanation
        });

        res.status(201).json(insertedRequest);
    } catch (err) {
        console.error('Error submitting liquidation request:', err);
        res.status(500).json({ message: 'Error submitting liquidation request', error: err.message });
    }
};


// Controller to handle updating the decision on a liquidation request
const updateLiquidationRequestDecision = async (req, res) => {
    const { request_id } = req.params;
    const { accepted, rejection_reason, decided_by } = req.body;

    console.log('Decide request route hit:', { request_id, accepted, rejection_reason, decided_by });

    if (!decided_by) {
        return res.status(400).json({ message: 'The decided_by field is required.' });
    }

    try {
        const updatedRequest = await liquidationRequestService.updateDecision({
            request_id,
            accepted,
            rejection_reason,
            decided_by
        });

        if (!updatedRequest) {
            return res.status(404).json({ message: 'No updated request found' });
        }

        res.status(200).json(updatedRequest);
    } catch (err) {
        console.error('Error updating request:', err);
        res.status(500).json({ message: 'Error updating request', error: err.message });
    }
};


// Controller to handle the cancellation of a liquidation request
const cancelLiquidationRequest = async (req, res) => {
    const { request_id } = req.params;

    console.log('Cancel liquidation request route hit:', { request_id });

    try {
        const canceledRequest = await liquidationRequestService.cancelRequest(request_id);

        if (!canceledRequest) {
            return res.status(404).json({ message: 'No request found to cancel' });
        }

        res.status(200).json(canceledRequest);
    } catch (err) {
        console.error('Error canceling request:', err);
        res.status(500).json({ message: 'Error canceling request', error: err.message });
    }
};

module.exports = {
    getAllLiquidationRequests,
    getLiquidationRequestsByEmployee,
    createLiquidationRequest,
    updateLiquidationRequestDecision,
    cancelLiquidationRequest,
};
