const express = require('express');
const path = require('path');
const cors = require('cors');
const leaderPortalRoutes = require('./routes/leaderPortal'); // Corrected variable name
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend on port 3000
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Use API routes for leader actions
app.use('/leader-portal', leaderPortalRoutes); // Use the correct variable

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
