const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// routes
/*
const employeesInfoRoute = require('./routes/employeesInfo');
const vacationsInfoRoute = require('./routes/vacationsInfo');
const requestsInfoRoute = require('./routes/requestsInfo');
const liquidationCancelRoute = require('./routes/liquidationCancelRoute');
const liquidationDecideRoute = require('./routes/liquidationDecideRoute');
const vacationRequestRoute = require('./routes/requestRoute');
const liqRequestRoute = require('./routes/liquidationRequestRoute');
const decideRequestRoute = require('./routes/decideRequestRoute');
const cancelRequestRoute = require('./routes/cancelRequestRoute');
const updateEmployee = require('./routes/employeeUpdateRoute');
const addEmployee = require('./routes/employeeAddRoute');
const deleteEmployee = require('./routes/EmployeeRemoveRoute');
*/
const liquidationRequestsInfo = require('./routes/liquidationRequestsInfo');
const api_liquidationRequestsInfo = require('./routes/api_liquidationRequestsInfo');

const photoRoute = require('./routes/photoRoute');
const employee_endpoint = require('./api/employee/routes'); 
const request_endpoint = require('./api/request/routes')
const liquidation_request_endpoint = require('./api/liquidation_request/routes')
const email_id = require('./api/email_id');
const employees_by_leader = require('./api/employees_by_leader');
const vacations_by_leader = require('./api/vacations_by_leader')


const app = express();
const port = process.env.PORT || 8080;

// Middleware: Handle CORS
app.use(
  cors({
    origin: [
      'https://quantumhr.azurewebsites.net',
      'http://localhost:3000',
      'https://quantumhr-api-ms.azure-api.net',
    ],
    credentials: true,
  })
);

// Middleware: Parse JSON bodies
app.use(express.json());

// Middleware: Protect API routes
const apiProtectionMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey === process.env.BACK_API_KEY) {
    next();
  } else {
    res.status(403).send('Forbidden: Invalid API Key');
  }
};

// Middleware: Additional API routing logic
const apiRoutingMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey === process.env.FRONT_API_KEY) {
    next(); // Allow access
  } else {
    res.status(403).send('Forbidden: Invalid API Key');
  }
};

// Routers
const apiProtector = express.Router(); // Group under '/protected'
const apiRouter = express.Router(); // Group under '/api'

apiProtector.use(apiProtectionMiddleware); // Protect '/protected' routes
apiRouter.use(apiRoutingMiddleware); // Protect '/api' routes

// Routes
app.use('/protected', apiProtector); // Attach protected API routes
app.use('/api', apiRouter); // Attach additional API routes

// Attach Routes
/*
app.use('/employees-info', employeesInfoRoute);
app.use('/add-employee', email_id);
app.use('/requests-info', requestsInfoRoute);
app.use('/request', vacationRequestRoute);
app.use('/decide-request', decideRequestRoute);
app.use('/cancel-request', cancelRequestRoute);
app.use('/update-employee', updateEmployee);
app.use('/remove-employee', deleteEmployee);
app.use('/liquidation-request', liqRequestRoute);
app.use('/liquidation-cancel-request', liquidationCancelRoute);
app.use('/liquidation-decide-request', liquidationDecideRoute);
*/
app.use('/employee-photos', photoRoute);

// Protected API routes
apiProtector.use('/liquidation-requests-info', liquidationRequestsInfo);
apiProtector.use('/employee', employee_endpoint);
apiProtector.use('/request', request_endpoint);
apiProtector.use('/liquidation-request' , liquidation_request_endpoint);
apiProtector.use('/vacations-info', vacations_by_leader);
apiProtector.use('/email_id', email_id);
apiProtector.use('/employees-by-leader', employees_by_leader);

// Additional API routes
apiRouter.use('/liquidation-requests-info', api_liquidationRequestsInfo);


// Logout functionality
app.get('/logout', (req, res) => {
  req.session = null; // Clear session data
  const logoutUrl = process.env.AZURE_AD_LOGOUT_URL || '/';
  res.redirect(logoutUrl);
});

// Serve static files from the React app (after API routes)
app.use(express.static(path.join(__dirname, 'client/build')));

// React Catch-All Route
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
