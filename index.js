const express = require('express');
const path = require('path');
const cors = require('cors');
const employeesInfoRoute = require('./routes/employeesInfo');
const vacationsInfoRoute = require('./routes/vacationsInfo');
const vacationsXemployeeInfoRoute = require('./routes/vacationsXemployeeInfo');
const requestsInfoRoute = require('./routes/requestsInfo');
const vacationRequestRoute = require('./routes/requestRoute');
const decideRequestRoute = require('./routes/decideRequestRoute');
const photoRoute = require('./routes/photoRoute');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware to handle CORS
app.use(cors({
    origin: 'https://quantumhr.azurewebsites.net',
    credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).send('Something went wrong!');
});


// API routes for data
app.use('/employees-info', employeesInfoRoute);
app.use('/vacations-info', vacationsInfoRoute);
app.use('/vacationsXemployee-info', vacationsXemployeeInfoRoute);
app.use('/requests-info', requestsInfoRoute);
app.use('/request', vacationRequestRoute);
app.use('/employee-photos', photoRoute);
app.use('/decide-request', decideRequestRoute);

// Protect the leader portal route
app.get('/leader-portal', (req, res) => {
    res.send('Welcome to the Leader Portal');
});

// Logout functionality
app.get('/logout', (req, res) => {
    req.session = null; // Clear session data
    const logoutUrl = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=https://quantumhr.azurewebsites.net`;
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
