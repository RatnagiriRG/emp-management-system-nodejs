const { getModels } = require('../config/database-postgres');

class UserRepositoryPostgres {
  constructor() {
    this.User = null;
  }

  // Initialize models (called after database connection)
  initialize() {
    const { User } = getModels();
    this.User = User;
  }

  // Create a new user
  async create(userData) {
    try {
      if (!this.User) this.initialize();
      
      const user = await this.User.create(userData);
      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      if (!this.User) this.initialize();
      
      const user = await this.User.findByPk(id);
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
      if (!this.User) this.initialize();
      
      const user = await this.User.findByUsernameOrEmail(identifier);
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
      if (!this.User) this.initialize();
      
      const user = await this.User.findOne({ where: { email } });
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
      if (!this.User) this.initialize();
      
      const user = await this.User.findOne({ where: { username } });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Check if user exists by email or username
  async exists(email, username) {
    try {
      if (!this.User) this.initialize();
      
      const user = await this.User.findOne({
        where: {
          [this.User.sequelize.Sequelize.Op.or]: [
            { email },
            { username }
          ]
        }
      });
      return !!user;
    } catch (error) {
      throw new Error(`Error checking user existence: ${error.message}`);
    }
  }

  // Update user
  async update(id, updateData) {
    try {
      if (!this.User) this.initialize();
      
      const [affectedRows] = await this.User.update(updateData, {
        where: { id },
        returning: true
      });
      
      if (affectedRows === 0) {
        throw new Error('User not found');
      }
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Update refresh token
  async updateRefreshToken(id, refreshToken) {
    try {
      if (!this.User) this.initialize();
      
      await this.User.update(
        { refreshToken },
        { where: { id } }
      );
    } catch (error) {
      throw new Error(`Error updating refresh token: ${error.message}`);
    }
  }

  // Update last login
  async updateLastLogin(id) {
    try {
      if (!this.User) this.initialize();
      
      await this.User.update(
        { lastLogin: new Date() },
        { where: { id } }
      );
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }
  }

  // Delete user (soft delete)
  async delete(id) {
    try {
      if (!this.User) this.initialize();
      
      const result = await this.User.update(
        { isActive: false },
        { where: { id } }
      );
      
      if (result[0] === 0) {
        throw new Error('User not found');
      }
      
      return { message: 'User deactivated successfully' };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Get all users with pagination
  async findAll(options = {}) {
    try {
      if (!this.User) this.initialize();
      
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        where = {}
      } = options;

      const offset = (page - 1) * limit;

      const result = await this.User.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      return {
        users: result.rows,
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw new Error(`Error finding users: ${error.message}`);
    }
  }

  // Find user by refresh token
  async findByRefreshToken(refreshToken) {
    try {
      if (!this.User) this.initialize();
      
      const user = await this.User.findOne({ where: { refreshToken } });
      if (!user) {
        throw new Error('Invalid refresh token');
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user by refresh token: ${error.message}`);
    }
  }
}

module.exports = UserRepositoryPostgres;
