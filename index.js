const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle CORS
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend on port 3000
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from the backend!' });
});

// Serve the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Veamos si ya todo está melo
