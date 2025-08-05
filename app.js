require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/database');
const routes = require('./src/routes');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const { requestLogger, corsOptions } = require('./src/middleware/middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
    🚀 Employee Management System API is running!
    📍 Server: http://localhost:${PORT}
    📍 API Base: http://localhost:${PORT}/api
    📍 Health Check: http://localhost:${PORT}/api/health
    🗄️  Database: MongoDB
    🌍 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

module.exports = app;
