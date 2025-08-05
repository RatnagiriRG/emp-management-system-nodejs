const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    this.jwtExpire = process.env.JWT_EXPIRE || '24h';
    this.refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE || '7d';
  }

  // Register a new user
  async register(userData) {
    try {
      // Validate required fields
      const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate password strength
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Check if user already exists
      const exists = await this.userRepository.exists(userData.email, userData.username);
      if (exists) {
        throw new Error('User with this email or username already exists');
      }

      // Set default role if not provided
      if (!userData.role) {
        userData.role = 'employee';
      }

      // Create user
      const user = await this.userRepository.create(userData);
      
      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user);
      
      // Save refresh token
      await this.userRepository.updateRefreshToken(user._id, refreshToken);

      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(identifier, password) {
    try {
      // Find user by username or email
      const user = await this.userRepository.findByUsernameOrEmail(identifier);
      
      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await this.userRepository.updateLastLogin(user._id);

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user);
      
      // Save refresh token
      await this.userRepository.updateRefreshToken(user._id, refreshToken);

      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtSecret);
      
      // Find user
      const user = await this.userRepository.findById(decoded.userId);
      
      // Check if refresh token matches
      if (user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);
      
      // Save new refresh token
      await this.userRepository.updateRefreshToken(user._id, tokens.refreshToken);

      return {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Logout user
  async logout(userId) {
    try {
      // Clear refresh token
      await this.userRepository.updateRefreshToken(userId, null);
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find user
      const user = await this.userRepository.findById(userId);
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      // Update password
      await this.userRepository.updateById(userId, { password: newPassword });
      
      // Clear all refresh tokens (logout from all devices)
      await this.userRepository.updateRefreshToken(userId, null);

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Generate JWT tokens
  generateTokens(user) {
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpire
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      this.jwtSecret,
      { expiresIn: this.refreshTokenExpire }
    );

    return { accessToken, refreshToken };
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      return await this.userRepository.findById(userId);
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated via profile
      delete updateData.password;
      delete updateData.role;
      delete updateData.refreshToken;

      return await this.userRepository.updateById(userId, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Validate user data
  validateUserData(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate || data.username !== undefined) {
      if (!data.username || data.username.trim() === '') {
        errors.push('Username is required');
      } else if (data.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
      }
    }

    if (!isUpdate || data.email !== undefined) {
      if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          errors.push('Invalid email format');
        }
      }
    }

    if (!isUpdate || data.password !== undefined) {
      if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
    }

    if (!isUpdate || data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim() === '') {
        errors.push('First name is required');
      }
    }

    if (!isUpdate || data.lastName !== undefined) {
      if (!data.lastName || data.lastName.trim() === '') {
        errors.push('Last name is required');
      }
    }

    if (data.role !== undefined) {
      const validRoles = ['admin', 'hr', 'manager', 'employee'];
      if (!validRoles.includes(data.role)) {
        errors.push('Invalid role');
      }
    }

    if (data.department !== undefined) {
      const validDepartments = ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales'];
      if (data.department && !validDepartments.includes(data.department)) {
        errors.push('Invalid department');
      }
    }

    return errors;
  }
}

module.exports = AuthService;
