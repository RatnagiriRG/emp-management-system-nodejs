const express = require('express');
const employeeRoutes = require('./employeeRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Default route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Employee Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      employees: '/api/employees',
      health: '/api/health'
    },
    authEndpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      refreshToken: 'POST /api/auth/refresh-token',
      profile: 'GET /api/auth/profile',
      updateProfile: 'PUT /api/auth/profile',
      changePassword: 'POST /api/auth/change-password'
    }
  });
});

module.exports = router;
