const express = require('express');
const path = require('path');
const cors = require('cors');
const employeesInfoRoute = require('./routes/employeesInfo');
const vacationsInfoRoute = require('./routes/vacationsInfo');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// API routes for data
app.use('/employees-info', employeesInfoRoute);
app.use('/vacations-info', vacationsInfoRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all for serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
