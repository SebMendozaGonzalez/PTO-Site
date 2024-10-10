const express = require('express');
const path = require('path');
const cors = require('cors');
const employeesInfoRoute = require('./routes/employeesInfo');
const vacationsInfoRoute = require('./routes/vacationsInfo');
const vacationsXemployeeInfoRoute = require('./routes/vacationsXemployeeInfo');
const requestsInfoRoute = require('./routes/requestsInfo');
const vacationRequestRoute = require('./routes/requestRoute');
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


// API routes for data
app.use('/employees-info', employeesInfoRoute);
app.use('/vacations-info', vacationsInfoRoute);
app.use('/vacationsXemployee-info', vacationsXemployeeInfoRoute);
app.use('/requests-info', requestsInfoRoute)
app.use('/request', vacationRequestRoute);

// Protect the leader portal route
app.get('/leader-portal', (req, res) => {
  res.send('Welcome to the Leader Portal');
});

app.get('/logout', (req, res) => {
  // Clear session or token data
  req.session = null; // Or whatever method you use to manage sessions
  
  // Redirect to the Azure AD logout URL
  const logoutUrl = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=https://quantumhr.azurewebsites.net`;
  res.redirect(logoutUrl); // Redirect to Azure AD to sign out
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all for serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});