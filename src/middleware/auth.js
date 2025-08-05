const jwt = require('jsonwebtoken');
const AuthService = require('../services/AuthService');

class AuthMiddleware {
  constructor() {
    this.authService = new AuthService();
  }

  // Verify JWT token middleware
  authenticate = async (req, res, next) => {
    try {
      let token;

      // Check for token in Authorization header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token is required'
        });
      }

      // Verify token
      const decoded = this.authService.verifyToken(token);
      
      // Add user info to request object
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  };

  // Optional authentication - doesn't fail if no token
  optionalAuth = async (req, res, next) => {
    try {
      let token;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (token) {
        const decoded = this.authService.verifyToken(token);
        req.user = decoded;
      }

      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  };

  // Role-based authorization middleware
  authorize = (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    };
  };

  // Check if user is admin
  isAdmin = (req, res, next) => {
    return this.authorize('admin')(req, res, next);
  };

  // Check if user is HR or admin
  isHROrAdmin = (req, res, next) => {
    return this.authorize('admin', 'hr')(req, res, next);
  };

  // Check if user is manager, HR, or admin
  isManagerOrAbove = (req, res, next) => {
    return this.authorize('admin', 'hr', 'manager')(req, res, next);
  };

  // Check if user can access employee data (own data or has permission)
  canAccessEmployee = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { role } = req.user;
      const employeeId = req.params.id;

      // Admin and HR can access all employee data
      if (role === 'admin' || role === 'hr') {
        return next();
      }

      // Managers can access employees in their department
      if (role === 'manager') {
        // Additional logic can be added here to check department match
        return next();
      }

      // Employees can only access their own data
      if (role === 'employee') {
        // Check if the employee is accessing their own data
        if (req.user.userId === employeeId) {
          return next();
        }
        return res.status(403).json({
          success: false,
          message: 'You can only access your own data'
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };

  // Rate limiting for sensitive operations
  rateLimitAuth = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    const attempts = new Map();

    return (req, res, next) => {
      const ip = req.ip;
      const now = Date.now();
      
      if (!attempts.has(ip)) {
        attempts.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
      }

      const userAttempts = attempts.get(ip);
      
      if (now > userAttempts.resetTime) {
        attempts.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
      }

      if (userAttempts.count >= maxAttempts) {
        return res.status(429).json({
          success: false,
          message: 'Too many attempts. Please try again later.'
        });
      }

      userAttempts.count++;
      next();
    };
  };

  // Validate request body for sensitive operations
  validateSensitiveOperation = (req, res, next) => {
    const sensitiveFields = ['password', 'role', 'permissions'];
    const hasChanges = Object.keys(req.body).some(key => 
      sensitiveFields.includes(key)
    );

    if (hasChanges && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can modify sensitive fields'
      });
    }

    next();
  };
}

module.exports = new AuthMiddleware();
