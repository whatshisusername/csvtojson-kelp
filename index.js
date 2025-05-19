const express = require('express');
const { initializeDatabase } = require('./config/db');
const uploadController = require('./controllers/uploadController');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize database
(async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();

// Routes
// Make sure uploadController.processCSV is a function
app.post('/api/process-csv', (req, res) => uploadController.processCSV(req, res));

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CSV file location: ${process.env.CSV_FILE_PATH}`);
});