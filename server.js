// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');

// Create an instance of the app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, JS) from the 'website' folder
app.use(express.static(path.join(__dirname, '/website')));

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Define the port
const port = 9000;

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// GET route to return projectData
app.get('/weather', (req, res) => {
  res.send(projectData);
  console.log('GET request received:', projectData);
});

// POST route to add data to projectData
app.post('/add', (req, res) => {
  const { temperature, date, userResponse } = req.body;

  // Add data to projectData object
  projectData = {
      temperature,
      date,
      userResponse,
  };

  console.log('POST request received:', projectData);
  res.send({ message: 'Data added successfully' });
});
  