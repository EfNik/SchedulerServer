const express = require('express');
const cors = require('cors'); // Import cors middleware
const shedulerRoutes = require('./routes/shedulerRoutes');
const logger = require('./middleware/logger'); // Import the logger middleware
require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,  // Adjust the origin to match the Vue frontend
    credentials: true, // Allow credentials
  }));

// Middleware
app.use(express.json());
app.use(logger); // Use the logger middleware

// Routes
app.use('/api', shedulerRoutes);

module.exports = app;
