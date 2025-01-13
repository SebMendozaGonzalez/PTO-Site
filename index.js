const express = require('express');
const path = require('path');
const cors = require('cors');
const employeesInfoRoute = require('./routes/employeesInfo');
const vacationsInfoRoute = require('./routes/vacationsInfo');
const email_id = require('./routes/email_id');
const requestsInfoRoute = require('./routes/requestsInfo');
const liquidationRequestsInfo = require('./routes/liquidationRequestsInfo');
const liquidationCancelRoute = require('./routes/liquidationCancelRoute');
const liquidationDecideRoute = require('./routes/liquidationDecideRoute');
const vacationRequestRoute = require('./routes/requestRoute');
const liqRequestRoute = require('./routes/liquidationRequestRoute');
const decideRequestRoute = require('./routes/decideRequestRoute');
const cancelRequestRoute = require('./routes/cancelRequestRoute');
const updateEmployee = require('./routes/employeeUpdateRoute');
const addEmployee = require('./routes/employeeAddRoute');
const deleteEmployee = require('./routes/EmployeeRemoveRoute');
const employeesByLeader = require('./routes/employeesByLeader');
const photoRoute = require('./routes/photoRoute');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware to handle CORS
app.use(cors({
    origin: ['https://quantumhr.azurewebsites.net', 'http://localhost:3000', 'https://quantumhr-api-ms.azure-api.net'],
    credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to protect API routes
const apiProtectionMiddleware = (req, res, next) => {
    const apiKey = req.headers['api-key'];
    if (apiKey === process.env.API_KEY) {
        next(); // Allow access
    } else {
        res.status(403).send('Forbidden: Invalid API Key');
    }
};

// API route group under '/api'
const apiRouter = express.Router();

apiRouter.use(apiProtectionMiddleware); // Protect all routes under '/api'


// Attach the protected API routes to the app
app.use('/api', apiRouter);

app.use('/employees-info', employeesInfoRoute);
app.use('/vacations-info', vacationsInfoRoute);
app.use('/email_id', email_id);
app.use('/requests-info', requestsInfoRoute);
app.use('/request', vacationRequestRoute);
app.use('/employee-photos', photoRoute);
app.use('/decide-request', decideRequestRoute);
app.use('/cancel-request', cancelRequestRoute);
app.use('/update-employee', updateEmployee);
app.use('/add-employee', addEmployee);
app.use('/remove-employee', deleteEmployee);
app.use('/employees-by-leader', employeesByLeader);
app.use('/liquidation-request', liqRequestRoute);
app.use('/liquidation-cancel-request', liquidationCancelRoute);
app.use('/liquidation-decide-request', liquidationDecideRoute);
apiRouter.use('/liquidation-requests-info', liquidationRequestsInfo);

// Logout functionality
app.get('/logout', (req, res) => {
    req.session = null; // Clear session data
    const logoutUrl = process.env.AZURE_AD_LOGOUT_URL || '/'; // Replace with actual logout URL
    res.redirect(logoutUrl); // Redirect to Azure AD logout
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all for serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
