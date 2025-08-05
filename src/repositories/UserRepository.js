const User = require('../models/User');

class UserRepository {
  // Create a new user
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find user by username or email
  async findByUsernameOrEmail(identifier) {
    try {
      const user = await User.findByUsernameOrEmail(identifier);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find user by username
  async findByUsername(username) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Update user by ID
  async updateById(id, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Update last login
  async updateLastLogin(id) {
    try {
      return await this.updateById(id, { lastLogin: new Date() });
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }
  }

  // Update refresh token
  async updateRefreshToken(id, refreshToken) {
    try {
      return await this.updateById(id, { refreshToken });
    } catch (error) {
      throw new Error(`Error updating refresh token: ${error.message}`);
    }
  }

  // Delete user by ID (soft delete)
  async deleteById(id) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Find all users with optional filters
  async findAll(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      const skip = (page - 1) * limit;
      
      const query = User.find(filters);
      
      if (sortBy) {
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        query.sort(sort);
      }
      
      const users = await query.skip(skip).limit(limit);
      const total = await User.countDocuments(filters);
      
      return {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  // Check if user exists by email or username
  async exists(email, username) {
    try {
      const user = await User.findOne({
        $or: [
          { email },
          { username }
        ]
      });
      return !!user;
    } catch (error) {
      throw new Error(`Error checking user existence: ${error.message}`);
    }
  }

  // Find users by role
  async findByRole(role, options = {}) {
    try {
      return await this.findAll({ role, isActive: true }, options);
    } catch (error) {
      throw new Error(`Error finding users by role: ${error.message}`);
    }
  }

  // Find users by department
  async findByDepartment(department, options = {}) {
    try {
      return await this.findAll({ department, isActive: true }, options);
    } catch (error) {
      throw new Error(`Error finding users by department: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
