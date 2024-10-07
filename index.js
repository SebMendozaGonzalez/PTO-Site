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
const port = process.env.PORT || 5000;

// Middleware to handle CORS
app.use(cors({
  origin: 'https://quantumvacations-b0cndcaagsgzhtfq.brazilsouth-01.azurewebsites.net',
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

const checkRole = (role) => {
  return (req, res, next) => {
    const userRoles = req.user.roles; // Assuming you are storing roles in user object
    if (userRoles && userRoles.includes(role)) {
      next();
    } else {
      res.status(403).send('You don\' have the permissions to enter this page');
    }
  };
};


// API routes for data
app.use('/employees-info', employeesInfoRoute);
app.use('/vacations-info', vacationsInfoRoute);
app.use('/vacationsXemployee-info', vacationsXemployeeInfoRoute);
app.use('/requests-info', requestsInfoRoute)
app.use('/request', vacationRequestRoute);

// Protect the leader portal route
app.get('/leader-portal', checkRole('Leader'), (req, res) => {
  res.send('Welcome to the Leader Portal');
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