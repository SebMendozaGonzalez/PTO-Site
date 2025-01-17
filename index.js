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
//const api_liquidationRequestsInfo = require('./routes/api_liquidationRequestsInfo');

const photoRoute = require('./routes/photoRoute');
const apiFrontdoor = require('./frontdoor-endpoints/routes')
const employee_endpoint = require('./backdoor-endpoints/employee/routes'); 
const request_endpoint = require('./backdoor-endpoints/request/routes')
const liquidation_request_endpoint = require('./backdoor-endpoints/liquidation_request/routes')
const email_id = require('./backdoor-endpoints/email_id');
const employees_by_leader = require('./backdoor-endpoints/employees_by_leader');
const vacations_by_leader = require('./backdoor-endpoints/vacations_by_leader')


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
const apiBackdoorMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey === process.env.BACK_API_KEY) {
    next();
  } else {
    res.status(403).send('Forbidden: Invalid API Key');
  }
};


// Routers
const apiBackdoor = express.Router(); // Group under '/protected'

apiBackdoor.use(apiBackdoorMiddleware); // Protect '/protected' routes


// Routes
app.use('/protected', apiBackdoor); // Attach protected API routes
app.use('/api', apiFrontdoor); // Attach additional API routes
app.use('/employee-photos', photoRoute);

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


// Backdoor endpoint routes
apiBackdoor.use('/liquidation-requests-info', liquidationRequestsInfo);
apiBackdoor.use('/employee', employee_endpoint);
apiBackdoor.use('/request', request_endpoint);
apiBackdoor.use('/liquidation-request' , liquidation_request_endpoint);
apiBackdoor.use('/vacations-info', vacations_by_leader);
apiBackdoor.use('/email_id', email_id);
apiBackdoor.use('/employees-by-leader', employees_by_leader);

// Frondoor endpoint routes
//apiFrontdoor.use('/liquidation-requests-info', api_liquidationRequestsInfo);


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
