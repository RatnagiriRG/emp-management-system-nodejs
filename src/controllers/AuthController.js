const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  // Register a new user
  register = async (req, res) => {
    try {
      const userData = req.body;
      
      // Validate input data
      const validationErrors = this.authService.validateUserData(userData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      const result = await this.authService.register(userData);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Login user
  login = async (req, res) => {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username/email and password are required'
        });
      }

      const result = await this.authService.login(identifier, password);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };

  // Refresh access token
  refreshToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token not provided'
        });
      }

      const result = await this.authService.refreshToken(refreshToken);
      
      // Set new refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };

  // Logout user
  logout = async (req, res) => {
    try {
      const userId = req.user.userId;
      
      await this.authService.logout(userId);
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Change password
  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      await this.authService.changePassword(userId, currentPassword, newPassword);
      
      // Clear refresh token cookie (logout from all devices)
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please login again.'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get user profile
  getProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await this.authService.getProfile(userId);
      
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  // Update user profile
  updateProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
      const updateData = req.body;

      // Validate input data for update
      const validationErrors = this.authService.validateUserData(updateData, true);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      const user = await this.authService.updateProfile(userId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Verify token (for frontend to check if user is authenticated)
  verifyToken = async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await this.authService.getProfile(userId);
      
      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: {
          user,
          authenticated: true
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        data: {
          authenticated: false
        }
      });
    }
  };
}

module.exports = AuthController;
